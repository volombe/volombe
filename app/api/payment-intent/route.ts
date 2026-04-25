import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

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

export async function POST(req: NextRequest) {
  try {
    const items: CartItem[] = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }

    const amount = Math.round(
      items.reduce((sum, i) => sum + i.price * i.qty, 0) * 100
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        items: JSON.stringify(
          items.map(i => ({ id: i.id, name: i.name, size: i.size, qty: i.qty }))
        ),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('[Volombe] PaymentIntent error:', err?.message);
    return NextResponse.json(
      { error: err?.message || 'Erreur inconnue' },
      { status: 500 }
    );
  }
}
