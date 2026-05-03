import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

interface CartItem {
  id: string
  name: string
  size: string
  price: number
  qty: number
  img?: string
}

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY || ''
  console.log('[Volombe] STRIPE_SECRET_KEY preview:', key.slice(0, 8) + '...' + key.slice(-4), '| longueur:', key.length)

  try {
    const items: CartItem[] = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.name} — Taille ${item.size}`,
          metadata: { size: item.size, productId: item.id },
          ...(item.img
            ? { images: [item.img.startsWith('http') ? item.img : `${baseUrl}/${item.img}`] }
            : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }))

    // Calcul du sous-total pour déterminer les frais de port
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)

    const freeShipping = {
      shipping_rate_data: {
        type: 'fixed_amount' as const,
        fixed_amount: { amount: 0, currency: 'eur' },
        display_name: 'Livraison offerte',
        delivery_estimate: {
          minimum: { unit: 'business_day' as const, value: 3 },
          maximum: { unit: 'business_day' as const, value: 5 },
        },
      },
    }

    const standardShipping = {
      shipping_rate_data: {
        type: 'fixed_amount' as const,
        fixed_amount: { amount: 599, currency: 'eur' },
        display_name: 'Livraison standard (3–5 jours ouvrés)',
        delivery_estimate: {
          minimum: { unit: 'business_day' as const, value: 3 },
          maximum: { unit: 'business_day' as const, value: 5 },
        },
      },
    }

    const shippingOptions = subtotal >= 70
      ? [freeShipping]
      : [standardShipping]

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'eur',
      line_items,
      locale: 'fr',
      shipping_options: shippingOptions,
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU'],
      },
      metadata: {
        items: JSON.stringify(items.map((i) => ({
          id: i.id,
          name: i.name,
          size: i.size,
          qty: i.qty,
        }))),
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const e = err as { type?: string; code?: string; message?: string }
    console.error('[Volombe] Stripe error type:', e?.type)
    console.error('[Volombe] Stripe error code:', e?.code)
    console.error('[Volombe] Stripe error message:', e?.message)
    return NextResponse.json(
      { error: e?.message || 'Erreur inconnue' },
      { status: 500 }
    )
  }
}
