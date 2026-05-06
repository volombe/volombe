import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

interface CartItem {
  id: string
  name: string
  size: string
  price: number
  qty: number
}

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, items }: { paymentIntentId: string; items: CartItem[] } = await req.json()

    if (!paymentIntentId || !items?.length) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const subtotal    = items.reduce((sum, i) => sum + i.price * i.qty, 0)
    const shippingCost = subtotal >= 70 ? 0 : 5.99
    const amount      = Math.round((subtotal + shippingCost) * 100)

    await stripe.paymentIntents.update(paymentIntentId, {
      amount,
      metadata: {
        items: JSON.stringify(items.map(i => ({
          id:    i.id,
          name:  i.name,
          size:  i.size,
          qty:   i.qty,
          price: i.price,
        }))),
        shippingCost: String(shippingCost),
      },
    })

    return NextResponse.json({ success: true, amount })
  } catch (err: unknown) {
    const e = err as { message?: string }
    console.error('[Volombe] Update PaymentIntent error:', e?.message)
    return NextResponse.json({ error: e?.message }, { status: 500 })
  }
}
