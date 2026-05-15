import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  qty: number;
  img?: string;
}

interface PaymentIntentBody {
  items: CartItem[];
  deliveryMode: 'home' | 'relay';
  relayId?: string;
  relayName?: string;
  relayAddress?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PaymentIntentBody = await req.json();
    const {
      items,
      deliveryMode = 'relay',
      relayId      = '',
      relayName    = '',
      relayAddress = '',
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }

    const subtotal     = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shippingCost = subtotal >= 70 ? 0 : (deliveryMode === 'relay' ? 4.99 : 6.99);
    const amount       = Math.round((subtotal + shippingCost) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        items: JSON.stringify(
          items.map(i => ({ id: i.id, name: i.name, size: i.size, qty: i.qty, price: i.price }))
        ),
        shippingCost: String(shippingCost),
        deliveryMode,
        relayId,
        relayName,
        relayAddress,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: unknown) {
    const e = err as { message?: string };
    console.error('[Volombe] PaymentIntent error:', e?.message);
    return NextResponse.json({ error: e?.message || 'Erreur inconnue' }, { status: 500 });
  }
}
