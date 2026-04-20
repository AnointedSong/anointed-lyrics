import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/ratelimit';
import { GenerateSchema, sanitizeText } from '@/lib/validation';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

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

const GENRE_INSTRUMENTS: Record<string, string> = {
  "Afrobeats": "log drums, talking drums, shekere, afro guitar, bass synth, brass stabs",
  "Afrobeats Gospel": "log drums, organ, choir pads, shekere, bass guitar, brass",
  "Amapiano": "log drum, bass synth, piano stabs, vocal chops, shaker",
  "Highlife": "trumpet, guitar, percussion, bass, palm wine guitar",
  "Afro-Fusion": "afro guitar, synth pads, 808 bass, log drums, brass",
  "Pop": "synth, electric guitar, bass, drums, keys",
  "R&B/Soul": "Rhodes piano, bass guitar, smooth drums, strings, vocal layers",
  "Gospel": "organ, choir, tambourine, bass guitar, piano, drums",
  "Hip-Hop/Rap": "808 bass, hi-hats, snare, synth, sampled loops",
  "Drill/Trap": "sliding 808s, dark piano, hi-hat rolls, drill snare, eerie synth",
  "Reggae/Dancehall": "riddim guitar, bass, one drop drums, organ, horns",
  "Rock/Alternative": "electric guitar, bass guitar, drums, distortion pedal",
  "Country": "acoustic guitar, fiddle, steel guitar, bass, banjo",
  "Jazz/Blues": "saxophone, piano, upright bass, brushed drums, trumpet",
  "EDM/Electronic": "synth leads, drop bass, kicks, arps, pads, risers",
  "Latin/Reggaeton": "dembow beat, reggaeton bass, Latin guitar, congas, synth",
  "Folk/Acoustic": "acoustic guitar, harmonica, mandolin, upright bass, cajón",
  "K-Pop": "synth, EDM drops, pop bass, electronic drums, vocal processing",
  "Indie": "jangly guitar, bass, lo-fi drums, synth textures, reverb",
  "Worship/Praise": "acoustic guitar, piano, pads, light drums, strings, choir",
};

const STRUCT_GUIDE: Record<string, string> = {
  Standard: "Intro → Verse 1 → Chorus → Verse 2 → Chorus → Bridge → Chorus → Outro",
  Short: "Verse 1 → Chorus → Verse 2 → Chorus → Outro",
  Epic: "Intro → Verse 1 → Pre-Chorus → Chorus → Verse 2 → Pre-Chorus → Chorus → Bridge → Breakdown → Final Chorus → Outro",
  "Hook-Heavy": "Hook → Verse 1 → Hook → Verse 2 → Hook → Bridge → Hook → Hook",
  "Chant-Driven": "Chant Intro → Verse 1 → Chant → Verse 2 → Chant → Build → Chant Outro",
  Freestyle: "Free-form — no fixed structure, follow the emotion",
};

export async function POST(req: NextRequest) {
  // 1. Auth check
  const user = await verifyUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  // 2. Rate limit — 5 generations per 60 seconds per user
  const { allowed, remaining, reset } = await checkRateLimit(user.id);
  if (!allowed) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Too many requests. Please wait ${retryAfter} seconds before generating again.` },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  // 3. Parse and validate input
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = GenerateSchema.safeParse(body.formData);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message || 'Invalid input';
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const formData = parsed.data;

  // 4. Sanitize free-text fields
  formData.topic = sanitizeText(formData.topic);
  formData.title = sanitizeText(formData.title || '');
  formData.notes = sanitizeText(formData.notes || '');

  // 5. Credit check
  const db = adminDb();
  const { data: balance } = await db.rpc('get_user_balance', { uid: user.id });
  if ((balance || 0) <= 0) {
    return NextResponse.json({ error: 'NO_CREDITS' }, { status: 403 });
  }

  // 6. Build prompt and call Claude
  const gi = GENRE_INSTRUMENTS[formData.genre || ''] || '';
  const sg = STRUCT_GUIDE[formData.structure || 'Standard'] || STRUCT_GUIDE.Standard;

  const prompt = `You are a world-class songwriter specializing in global music, especially African genres. Generate complete, original Suno-ready lyrics.

SONG BRIEF:
- Title: ${formData.title || "(suggest a great one)"}
- Concept: ${formData.topic}
- Genre: ${formData.genre || "AI Decides"}
- Mood: ${formData.mood || "AI Decides"}
- Language: ${formData.language}
- Vocalist: ${formData.vocalist || "AI Decides"}
- Structure: ${formData.structure} → ${sg}
- Tempo: ${formData.tempo}
${gi ? `- Instruments: ${gi}` : ''}
${formData.notes ? `- Special Notes: ${formData.notes}` : ''}

FORMATTING RULES:
1. Section tags on own line: [Intro], [Verse 1], [Chorus], [Bridge], [Outro], etc.
${formData.auto_cues ? '2. Add inline cues: [whispered], [building], [drums drop], [ad-libs], etc.' : '2. No performance cues.'}
${formData.call_response ? '3. Use [Lead] and [Crowd] for call-and-response.' : '3. No call-and-response.'}
${formData.metadata_header ? `4. Start with [[metadata]] block with Title, Genre, Mood, Tempo, Vocalist, Language.` : '4. No metadata block.'}
5. Singable lyrics — rhythm, rhyme, vivid imagery, genre-authentic.
6. Catchy memorable chorus.
7. Return ONLY lyrics. No explanations.
8. Provide a Suno style prompt (genre, vocals, tempo, instruments, vibe — comma separated).

Return strict JSON: { "title": string, "lyrics": string, "style_prompt": string }. No markdown.`;

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('');

    const result = JSON.parse(text.replace(/```json|```/g, '').trim());

    // 7. Deduct credit AFTER successful generation
    await db.from('credit_transactions').insert({
      user_id: user.id,
      amount: -1,
      reason: 'generation',
    });

    const { data: newBal } = await db.rpc('get_user_balance', { uid: user.id });

    return NextResponse.json({
      title: result.title,
      lyrics: result.lyrics,
      style_prompt: result.style_prompt,
      credits: newBal || 0,
      rateLimit: { remaining },
    });

  } catch (e: any) {
    console.error('Generate error:', e);
    return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 });
  }
}
