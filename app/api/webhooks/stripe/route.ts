import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function adminDb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

const CREDIT_PACKS: Record<string, number> = {
  [process.env.STRIPE_PRICE_50 || '']: 50,
  [process.env.STRIPE_PRICE_150 || '']: 150,
  [process.env.STRIPE_PRICE_300 || '']: 300,
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  if (!sig) return new Response('No signature', { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e: any) {
    return new Response(`Webhook Error: ${e.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (!userId) return new Response('No userId', { status: 400 });

    const items = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = items.data[0]?.price?.id || '';
    const amount = CREDIT_PACKS[priceId] || 50;

    const db = adminDb();
    await db.from('credit_transactions').insert({ user_id: userId, amount, reason: 'purchase' });
  }

  return new Response('OK', { status: 200 });
}
