import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function adminDb() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

async function verifyUser(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const db = adminDb();
  const { data: { user } } = await db.auth.getUser(token);
  return user;
}

// GET - list user's songs
export async function GET(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 });

  const db = adminDb();
  const { data, error } = await db.from('songs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ songs: data || [] });
}

// POST - save a song
export async function POST(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 });

  const body = await req.json();
  const db = adminDb();

  const { error } = await db.from('songs').insert({
    user_id: user.id,
    title: body.title || 'Untitled',
    topic: body.topic || '',
    genre: body.genre || '',
    mood: body.mood || '',
    language: body.language || '',
    structure: body.structure || '',
    style_tags: body.style_tags || '',
    content: body.content || '',
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE - remove a song
export async function DELETE(req: NextRequest) {
  const user = await verifyUser(req);
  if (!user) return NextResponse.json({ error: 'Auth required' }, { status: 401 });

  const { id } = await req.json();
  const db = adminDb();

  const { error } = await db.from('songs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
