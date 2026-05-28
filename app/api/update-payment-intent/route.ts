import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { validateCartItems } from '@/lib/products'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

interface RawCartItem {
  id?: unknown
  size?: unknown
  qty?: unknown
  // price ignoré — le prix réel vient du catalogue serveur (lib/products.ts)
  [key: string]: unknown
}

interface UpdateBody {
  paymentIntentId: string
  items: RawCartItem[]
  deliveryMode?: 'home' | 'relay'
  relayId?: string
  relayName?: string
  relayAddress?: string
}

export async function POST(req: NextRequest) {
  try {
    const {
      paymentIntentId,
      items,
      deliveryMode = 'relay',
      relayId      = '',
      relayName    = '',
      relayAddress = '',
    }: UpdateBody = await req.json()

    if (!paymentIntentId || !items?.length) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    let validatedItems
    try {
      validatedItems = validateCartItems(items)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Panier invalide'
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const subtotal     = validatedItems.reduce((sum, i) => sum + i.unitPrice * i.qty, 0)
    const shippingCost = subtotal >= 70 ? 0 : (deliveryMode === 'relay' ? 4.99 : 6.99)
    const amount       = Math.round((subtotal + shippingCost) * 100)

    await stripe.paymentIntents.update(paymentIntentId, {
      amount,
      metadata: {
        items: JSON.stringify(
          validatedItems.map(i => ({
            id:        i.id,
            name:      i.name,
            size:      i.size,
            qty:       i.qty,
            unitPrice: i.unitPrice,
          }))
        ),
        shippingCost: String(shippingCost),
        deliveryMode,
        relayId,
        relayName,
        relayAddress,
      },
    })

    return NextResponse.json({ success: true, amount })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[Volombe] Update PaymentIntent error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
