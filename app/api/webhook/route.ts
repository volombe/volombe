// @ts-nocheck
import { getSupabaseAdmin } from '@/lib/supabase'
import { getResend } from '@/lib/resend'
import OrderConfirmation from '@/lib/emails/orderConfirmation'
import AdminNotification from '@/lib/emails/adminNotification'
import type { OrderItem, ShippingAddress } from '@/lib/emails/orderConfirmation'
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createElement } from 'react'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia',
  })

  const body        = await request.text()
  const sig         = request.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('[Volombe] Webhook signature invalide:', err?.message)
    return NextResponse.json({ error: 'Webhook invalide' }, { status: 400 })
  }

  /* ── Traitement paiement confirmé ── */
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'payment_intent.succeeded'
  ) {
    const session = event.data.object as any
    const items: Array<{ id: string; size: string; qty: number }> =
      session.metadata?.items ? JSON.parse(session.metadata.items) : []

    /* ── 1. Décrément stock Supabase (logique existante inchangée) ── */
    const db = getSupabaseAdmin()

    for (const item of items) {
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

    /* ── 2. Envoi emails — uniquement pour checkout.session.completed ── */
    if (event.type === 'checkout.session.completed') {
      try {
        /* Récupération données Stripe */
        const lineItemsResult = await stripe.checkout.sessions.listLineItems(
          session.id,
          { expand: ['data.price.product'] }
        )

        const customerEmail: string  = session.customer_details?.email ?? ''
        const customerName: string   = session.customer_details?.name  ?? 'Client'
        const totalAmount: number    = (session.amount_total ?? 0) / 100

        const rawShipping =
          session.shipping_details ??
          session.collected_information?.shipping_details

        const shippingAddress: ShippingAddress = {
          line1:      rawShipping?.address?.line1      ?? '',
          city:       rawShipping?.address?.city       ?? '',
          postalCode: rawShipping?.address?.postal_code ?? '',
          country:    rawShipping?.address?.country    ?? '',
        }

        /* Construction des items email depuis les métadonnées */
        const emailItems: OrderItem[] = items.map((item) => ({
          name:      item.id,
          size:      item.size,
          quantity:  item.qty || 1,
          unitPrice: totalAmount / (items.reduce((s, i) => s + (i.qty || 1), 0) || 1),
        }))

        /* Envoi en parallèle — Promise.allSettled ne throw jamais */
        const resend = getResend()
        const [clientResult, adminResult] = await Promise.allSettled([
          resend.emails.send({
            from:    'VOLOMBE <noreply@volombe.fr>',
            to:      customerEmail,
            subject: 'Votre commande Volombe est confirmée',
            react:   createElement(OrderConfirmation, {
              customerName,
              customerEmail,
              items: emailItems,
              totalAmount,
              shippingAddress,
            }),
          }),
          resend.emails.send({
            from:    'VOLOMBE <noreply@volombe.fr>',
            to:      'sav.contact@volombe.fr',
            subject: `🛒 Nouvelle commande — ${customerName} — ${totalAmount.toFixed(2)} €`,
            react:   createElement(AdminNotification, {
              customerName,
              customerEmail,
              items: emailItems,
              totalAmount,
              shippingAddress,
            }),
          }),
        ])

        if (clientResult.status === 'fulfilled') {
          console.log('[Resend] Email client envoyé à', customerEmail)
        } else {
          console.error('[Resend] Échec email client:', clientResult.reason)
        }

        if (adminResult.status === 'fulfilled') {
          console.log('[Resend] Email admin envoyé')
        } else {
          console.error('[Resend] Échec email admin:', adminResult.reason)
        }

      } catch (emailErr: any) {
        /* Le webhook retourne toujours 200 — les erreurs email ne bloquent jamais Stripe */
        console.error('[Resend] Erreur inattendue:', emailErr?.message)
      }
    }
  }

  return NextResponse.json({ received: true })
}
