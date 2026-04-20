'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { AppShell, C, font, Field, Row, TextInput, AreaInput, Dropdown, Toggle, PillBtn, SmBtn } from '@/lib/components';
import { motion } from 'framer-motion';

const GENRES=["Afrobeats","Afrobeats Gospel","Amapiano","Highlife","Afro-Fusion","Pop","R&B/Soul","Gospel","Hip-Hop/Rap","Drill/Trap","Reggae/Dancehall","Rock/Alternative","Country","Jazz/Blues","EDM/Electronic","Latin/Reggaeton","Folk/Acoustic","K-Pop","Indie","Worship/Praise"];
const MOODS=["Celebratory","Triumphant","Empowering","Spiritual","Party/Hype","Energetic","Romantic","Melancholic","Reflective","Nostalgic","Rebellious","Dark/Moody","Peaceful","Majestic","Raw/Gritty"];
const LANGUAGES=["English","French","Portuguese","Spanish","Korean-English Mix","Multilingual Mix","Nigerian Pidgin","Yoruba-English Mix","Igbo-English Mix","Patois/Jamaican Creole","Swahili"];
const VOCALISTS=["Male","Female","Group/Choir","Duet","Rapper + Singer"];
const STRUCTURES=["Standard","Short","Epic","Hook-Heavy","Chant-Driven","Freestyle"];
const TEMPOS=["Slow (70–90 BPM)","Medium (90–110 BPM)","Upbeat (110–130 BPM)","High Energy (130–150 BPM)","Flat (150+ BPM)","AI Decides"];

const DEFAULTS = { title:'',topic:'',genre:'',mood:'',language:'English',vocalist:'',structure:'Standard',tempo:'AI Decides',auto_cues:true,call_response:false,metadata_header:true,notes:'' };

export default function GeneratorPage() {
  const router = useRouter();
  const { user, loading, getToken, signOut } = useAuth();
  const [credits, setCredits] = useState(0);
  const [values, setValues] = useState(DEFAULTS);
  const [result, setResult] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');
  const [autoSaved, setAutoSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return; }
    if (!user) return;
    fetchCredits();
  }, [user, loading]);

  const fetchCredits = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/credits', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.credits !== undefined) setCredits(data.credits);
    } catch (e) { console.error('Failed to fetch credits', e); }
  };

  const update = (k: string, v: any) => setValues(p => ({ ...p, [k]: v }));

  const generate = async () => {
    if (!values.topic.trim()) { setError('Add a song concept first'); return; }
    if (credits <= 0) { setError('No credits remaining — purchase more from Dashboard'); return; }
    setGenerating(true); setResult(null); setError(''); setAutoSaved(false);

    try {
      const token = await getToken();
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ formData: values }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Generation failed');
        setGenerating(false);
        return;
      }

      const generated = { title: data.title, lyrics: data.lyrics, style_prompt: data.style_prompt };
      setResult(generated);

      // Update credits from server response
      if (data.credits !== undefined) {
        setCredits(data.credits);
      } else {
        // Fallback — refetch from server to get accurate balance
        await fetchCredits();
      }

      // Auto-save to archive immediately after generation
      try {
        await fetch('/api/songs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: data.title,
            topic: values.topic,
            genre: values.genre,
            mood: values.mood,
            language: values.language,
            structure: values.structure,
            style_tags: data.style_prompt,
            content: data.lyrics,
          }),
        });
        setAutoSaved(true);
      } catch (saveErr) {
        console.error('Auto-save failed:', saveErr);
        // Don't show error to user — lyrics are still shown, they can copy them
      }

    } catch (e) {
      setError('Generation failed — please try again');
      // Refetch real credit balance in case of partial failure
      await fetchCredits();
    }
    setGenerating(false);
  };

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label); setTimeout(() => setCopied(''), 1800);
  };

  const exportTxt = () => {
    if (!result) return;
    const blob = new Blob([`${result.title}\n\nStyle: ${result.style_prompt}\n\n${result.lyrics}`], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `${result.title.replace(/\s+/g, '-')}.txt`; a.click();
  };

  const handleSignOut = async () => { await signOut(); router.push('/login'); };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: C.muted }}>Loading…</p>
    </div>
  );

  return (
    <AppShell user={user} credits={credits} onSignOut={handleSignOut}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: C.muted, marginBottom: 20 }}>
            <span style={{ color: C.gold }}>●</span> &nbsp;Lyric Studio for Suno
          </div>
          <h1 style={{ fontFamily: font.display, fontSize: "clamp(36px,5vw,56px)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            Write songs that <em style={{ color: C.gold, fontStyle: "normal", fontWeight: 500 }}>sing</em> themselves.
          </h1>
          <p style={{ marginTop: 20, fontSize: 17, color: C.muted, maxWidth: 480, lineHeight: 1.6 }}>
            Generate fully-structured lyrics with Suno metatags — verses, choruses, bridges, and style prompts ready to paste.
          </p>
        </motion.div>

        {error && (
          <div style={{ background: "#fff0f0", border: `1px solid ${C.danger}33`, borderRadius: 6, padding: "12px 16px", marginBottom: 24, color: C.danger, fontSize: 14 }}>
            {error}
            {error.includes('credits') && (
              <a href="/dashboard" style={{ color: C.gold, marginLeft: 8, textDecoration: "underline" }}>Buy credits →</a>
            )}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <Field label="Song Title"><TextInput value={values.title} onChange={(v: string) => update("title", v)} placeholder="e.g. Rise Again" large /></Field>
          <Field label="Song Concept"><AreaInput value={values.topic} onChange={(v: string) => update("topic", v)} placeholder="Describe what the song is about — the story, emotion, message, or theme…" large rows={4} /></Field>
          <Row>
            <Field label="Genre"><Dropdown value={values.genre} onChange={(v: string) => update("genre", v)} options={GENRES} placeholder="Select genre" /></Field>
            <Field label="Mood"><Dropdown value={values.mood} onChange={(v: string) => update("mood", v)} options={MOODS} placeholder="Select mood" /></Field>
          </Row>
          <Row>
            <Field label="Language"><Dropdown value={values.language} onChange={(v: string) => update("language", v)} options={LANGUAGES} placeholder="Select language" /></Field>
            <Field label="Vocalist"><Dropdown value={values.vocalist} onChange={(v: string) => update("vocalist", v)} options={VOCALISTS} placeholder="Select vocalist" /></Field>
          </Row>
          <Row>
            <Field label="Structure"><Dropdown value={values.structure} onChange={(v: string) => update("structure", v)} options={STRUCTURES} placeholder="Select structure" /></Field>
            <Field label="Tempo"><Dropdown value={values.tempo} onChange={(v: string) => update("tempo", v)} options={TEMPOS} placeholder="Select tempo" /></Field>
          </Row>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Toggle label="Auto-Cues" desc="Add performance cues e.g. [whispered], [building], [drop]" checked={values.auto_cues} onChange={(v: boolean) => update("auto_cues", v)} />
            <Toggle label="Call & Response" desc="Include [Lead] / [Crowd] call-and-response lines" checked={values.call_response} onChange={(v: boolean) => update("call_response", v)} />
            <Toggle label="Metadata Header" desc="Prepend a [[metadata]] block for Suno context" checked={values.metadata_header} onChange={(v: boolean) => update("metadata_header", v)} />
          </div>
          <Field label="Notes (optional)">
            <AreaInput value={values.notes} onChange={(v: string) => update("notes", v)} placeholder="Any extra instructions — specific lines, themes to avoid, cultural references, artist inspiration…" rows={3} />
          </Field>
          <div style={{ paddingTop: 8, display: "flex", alignItems: "center", gap: 16 }}>
            <PillBtn onClick={generate} disabled={generating || !values.topic.trim() || credits <= 0} dark large>
              {generating ? "⏳ Composing…" : credits <= 0 ? "🔒 No Credits" : "✦ Generate Lyrics"}
            </PillBtn>
            <span style={{ fontSize: 12, color: C.muted }}>{credits} credit{credits !== 1 ? "s" : ""} remaining</span>
          </div>
        </div>

        {/* Loading */}
        {generating && !result && (
          <div style={{ marginTop: 56, border: `1px solid ${C.border}`, borderRadius: 6, padding: 48, textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.gold}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
            <div style={{ fontFamily: font.display, fontSize: 22, fontStyle: "italic", color: C.muted }}>Composing your song…</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>This may take 15–30 seconds</div>
          </div>
        )}

        {/* Result */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 56, background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${C.borderLight}`, flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: C.gold, fontSize: 16 }}>✦</span>
                <div>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted }}>Generated</div>
                  <div style={{ fontFamily: font.display, fontSize: 18, marginTop: 2 }}>{result.title}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {autoSaved && (
                  <span style={{ fontSize: 11, color: C.success, textTransform: "uppercase", letterSpacing: "0.1em" }}>✓ Saved to archive</span>
                )}
                {result.style_prompt && (
                  <SmBtn onClick={() => copy(result.style_prompt, 'style')}>{copied === 'style' ? '✓ Copied' : 'Copy Style'}</SmBtn>
                )}
                <SmBtn onClick={() => copy(result.lyrics, 'lyrics')}>{copied === 'lyrics' ? '✓ Copied' : 'Copy Lyrics'}</SmBtn>
                <SmBtn onClick={exportTxt}>Export .txt</SmBtn>
                <SmBtn onClick={() => router.push('/archive')}>View Archive →</SmBtn>
              </div>
            </div>

            {result.style_prompt && (
              <div style={{ padding: "12px 24px", borderBottom: `1px solid ${C.borderLight}`, background: "#F7F6F2" }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted, marginBottom: 4 }}>Suno Style Prompt</div>
                <div style={{ fontFamily: font.mono, fontSize: 12, color: C.fgSoft }}>{result.style_prompt}</div>
              </div>
            )}

            <pre style={{ padding: "32px 24px", whiteSpace: "pre-wrap", fontFamily: font.mono, fontSize: 14, lineHeight: 1.9, color: C.fgSoft, margin: 0 }}>
              {result.lyrics}
            </pre>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
