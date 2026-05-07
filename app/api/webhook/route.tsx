// @ts-nocheck
import { getSupabaseAdmin } from '@/lib/supabase'
import { getResend } from '@/lib/resend'
import OrderConfirmation from '@/lib/emails/orderConfirmation'
import AdminNotification from '@/lib/emails/adminNotification'
import { render } from '@react-email/render'
import { createElement } from 'react'
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

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

  // ── charge.succeeded : données client + email toujours disponibles ──
  if (event.type === 'charge.succeeded') {
    const charge = event.data.object as Stripe.Charge

    // Récupérer le PaymentIntent lié pour les métadonnées (items, shippingCost, shipping)
    let pi: Stripe.PaymentIntent | null = null
    try {
      pi = await stripe.paymentIntents.retrieve(
        charge.payment_intent as string
      )
    } catch (piErr: any) {
      console.error('[Volombe] PaymentIntent retrieve error:', piErr?.message)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    // Métadonnées items depuis le PaymentIntent
    const metaItems: Array<{ id: string; size: string; qty: number; name: string; price: number }> =
      pi.metadata?.items ? JSON.parse(pi.metadata.items) : []

    // ── 1. STOCK — décrémenter dans Supabase ──────────────────────────
    try {
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
    } catch (stockErr: any) {
      console.error('[Volombe] Erreur stock Supabase:', stockErr?.message)
    }

    // ── 2. EMAILS — dans un try/catch complètement isolé ──────────────
    try {
      const customerEmail: string | null = charge.billing_details?.email ?? null
      const customerName: string =
        charge.billing_details?.name ??
        pi.shipping?.name ??
        'Client'

      if (!customerEmail) {
        console.error('[Resend] customerEmail introuvable dans charge.billing_details — envoi annulé')
      } else {
        const shipping = pi.shipping
        const shippingAddress = {
          line1:      shipping?.address?.line1       ?? charge.shipping?.address?.line1       ?? '',
          city:       shipping?.address?.city        ?? charge.shipping?.address?.city        ?? '',
          postalCode: shipping?.address?.postal_code ?? charge.shipping?.address?.postal_code ?? '',
          country:    shipping?.address?.country     ?? charge.shipping?.address?.country     ?? '',
        }

        const totalAmount  = charge.amount / 100
        const shippingCost = parseFloat(pi.metadata?.shippingCost ?? '0')

        const items = metaItems.map((item) => ({
          name:      item.name  ?? item.id ?? 'Produit',
          quantity:  item.qty   ?? 1,
          unitPrice: item.price ?? 0,
          size:      item.size  ?? '',
        }))

        const emailProps = {
          customerName,
          customerEmail,
          items,
          totalAmount,
          shippingCost,
          shippingAddress,
        }

        // Pré-rendre les composants en HTML via @react-email/render
        const [clientHtml, adminHtml] = await Promise.all([
          render(createElement(OrderConfirmation, emailProps)),
          render(createElement(AdminNotification, emailProps)),
        ])

        const resend = getResend()
        const [clientResult, adminResult] = await Promise.allSettled([
          resend.emails.send({
            from:    'VOLOMBE <noreply@volombe.fr>',
            to:      [customerEmail],
            subject: 'Merci pour votre commande — VOLOMBE',
            html:    clientHtml,
          }),
          resend.emails.send({
            from:    'VOLOMBE <noreply@volombe.fr>',
            to:      ['sav.contact@volombe.fr'],
            subject: `Nouvelle commande — ${customerName}`,
            html:    adminHtml,
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
      }
    } catch (emailErr: any) {
      console.error('[Resend] Erreur inattendue:', emailErr?.message)
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
