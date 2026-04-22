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

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const db = adminDb();

  // Get all users
  const { data: authUsers } = await db.auth.admin.listUsers();

  // Get balances and song counts for each user
  const users = await Promise.all((authUsers?.users || []).map(async (u) => {
    const { data: balance } = await db.rpc('get_user_balance', { uid: u.id });
    const { count } = await db.from('songs').select('*', { count: 'exact', head: true }).eq('user_id', u.id);
    return {
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      balance: balance || 0,
      song_count: count || 0,
    };
  }));

  // Sort by newest first
  users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({ users });
}
