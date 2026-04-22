import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAILS = ['hello@anointedrhythms.com']; // ← change to your email

function adminDb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const db = adminDb();
  const { data: { user } } = await db.auth.getUser(token);
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) return null;
  return user;
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { userId, amount, reason } = await req.json();

  if (!userId || !amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const db = adminDb();

  const { error } = await db.from('credit_transactions').insert({
    user_id: userId,
    amount: amount,
    reason: reason || 'gift',
  });

  if (error) {
    console.error('Credit insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get new balance
  const { data: newBalance } = await db.rpc('get_user_balance', { uid: userId });

  return NextResponse.json({ success: true, newBalance });
}
