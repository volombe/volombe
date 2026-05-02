// @ts-nocheck
import { getSupabaseAdmin } from '@/lib/supabase'
import { getResend } from '@/lib/resend'
import OrderConfirmation from '@/lib/emails/orderConfirmation'
import AdminNotification from '@/lib/emails/adminNotification'
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createElement } from 'react'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia',
  })

  const body          = await request.text()
  const sig           = request.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('[Volombe] Webhook signature invalide:', err?.message)
    return NextResponse.json({ error: 'Webhook invalide' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // ── 1. STOCK — décrémenter dans Supabase ──────────────────────────
    const metaItems: Array<{ id: string; size: string; qty: number }> =
      session.metadata?.items ? JSON.parse(session.metadata.items) : []

    const db = getSupabaseAdmin()

    for (const item of metaItems) {
      const taille  = item.size?.toLowerCase()
      const produit = item.id?.toLowerCase()
      const qty     = item.qty || 1

      if (!taille || !produit) continue

      const { data: stockRow } = await db
        .from('stock')
        .select(taille)
        .eq('produit', produit)
        .single()

      const stock = stockRow as Record<string, number> | null

      if (stock && stock[taille] !== undefined) {
        const newQty = Math.max(0, stock[taille] - qty)
        await db
          .from('stock')
          .update({ [taille]: newQty })
          .eq('produit', produit)
        console.log(`[Volombe] Stock ${produit} ${taille}: ${stock[taille]} → ${newQty}`)
      }
    }

    // ── 2. EMAILS — dans un try/catch complètement isolé ──────────────
    try {
      // Récupérer les line items avec les données produit
      const lineItemsResponse = await stripe.checkout.sessions.listLineItems(
        session.id,
        { expand: ['data.price.product'] }
      )

      // Données client
      const customerEmail = session.customer_details?.email
      const customerName  = session.customer_details?.name ?? 'Client'

      // Adresse de livraison
      const shipping =
        session.shipping_details ??
        (session as any).collected_information?.shipping_details

      const shippingAddress = {
        line1:      shipping?.address?.line1       ?? '',
        city:       shipping?.address?.city        ?? '',
        postalCode: shipping?.address?.postal_code ?? '',
        country:    shipping?.address?.country     ?? '',
      }

      // Construire les items depuis les line items Stripe
      const items = lineItemsResponse.data.map((item) => ({
        name:      (item.price?.product as Stripe.Product)?.name ?? item.description ?? 'Produit',
        quantity:  item.quantity ?? 1,
        unitPrice: (item.price?.unit_amount ?? 0) / 100,
        size:      (item.price?.product as Stripe.Product)?.metadata?.size ?? '',
      }))

      // Montants
      const totalAmount = (session.amount_total ?? 0) / 100
      const shippingCost = (session.shipping_cost?.amount_total ?? 0) / 100

      // Envoi en parallèle — Promise.allSettled ne throw jamais
      const resend = getResend()
      const [clientResult, adminResult] = await Promise.allSettled([
        resend.emails.send({
          from:    'VOLOMBE <noreply@volombe.fr>',
          to:      [customerEmail!],
          subject: 'Merci pour votre commande — VOLOMBE',
          react:   createElement(OrderConfirmation, {
            customerName,
            customerEmail: customerEmail!,
            items,
            totalAmount,
            shippingCost,
            shippingAddress,
          }),
        }),
        resend.emails.send({
          from:    'VOLOMBE <noreply@volombe.fr>',
          to:      ['sav.contact@volombe.fr'],
          subject: `Nouvelle commande — ${customerName}`,
          react:   createElement(AdminNotification, {
            customerName,
            customerEmail: customerEmail!,
            items,
            totalAmount,
            shippingCost,
            shippingAddress,
          }),
        }),
      ])

      console.log(
        '[Resend] Client:',
        clientResult.status,
        clientResult.status === 'fulfilled'
          ? clientResult.value?.data?.id
          : clientResult.reason
      )
      console.log(
        '[Resend] Admin:',
        adminResult.status,
        adminResult.status === 'fulfilled'
          ? adminResult.value?.data?.id
          : adminResult.reason
      )
    } catch (emailErr: any) {
      // Ne jamais throw — Stripe doit toujours recevoir un 200
      console.error('[Resend] Erreur inattendue:', emailErr?.message)
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
