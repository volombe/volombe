// @ts-nocheck
import { getSupabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia',
  })

  const body = await request.text()
  const sig  = request.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('[Volombe] Webhook signature invalide:', err?.message)
    return NextResponse.json({ error: 'Webhook invalide' }, { status: 400 })
  }

  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'payment_intent.succeeded'
  ) {
    const session = event.data.object as any
    const items: Array<{ id: string; size: string; qty: number }> =
      session.metadata?.items ? JSON.parse(session.metadata.items) : []

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
  }

  return NextResponse.json({ received: true })
}
