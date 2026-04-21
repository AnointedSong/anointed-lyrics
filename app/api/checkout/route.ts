import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

function adminDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    // Log env vars (masked for security)
    console.log('=== CHECKOUT DEBUG ===');
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log('STRIPE_SECRET_KEY prefix:', process.env.STRIPE_SECRET_KEY?.substring(0, 7));
    console.log('SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);

    // 1. Verify user
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    console.log('Token exists:', !!token);

    if (!token) {
      return NextResponse.json({ error: 'Auth required' }, { status: 401 });
    }

    const db = adminDb();
    const { data: { user }, error: authError } = await db.auth.getUser(token);
    console.log('User exists:', !!user, 'Auth error:', authError?.message);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 2. Get price ID
    const body = await req.json();
    const { priceId } = body;
    console.log('Price ID received:', priceId);

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
    }

    // 3. Create Stripe session
    console.log('Creating Stripe session...');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?canceled=true`,
      metadata: { userId: user.id },
    });

    console.log('Session created:', session.id);
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('=== CHECKOUT ERROR ===');
    console.error('Message:', error?.message);
    console.error('Type:', error?.type);
    console.error('Code:', error?.code);
    console.error('Full error:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: error?.message || 'Checkout failed', type: error?.type, code: error?.code },
      { status: 500 }
    );
  }
}