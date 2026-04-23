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

const SUNO_AFFILIATE = 'https://www.musicapi.ai/suno-api?via=anointed-lyrics';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function GeneratorPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
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
    } catch (e) { console.error(e); }
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
      if (!res.ok) { setError(data.error || 'Generation failed'); setGenerating(false); return; }
      const generated = { title: data.title, lyrics: data.lyrics, style_prompt: data.style_prompt };
      setResult(generated);
      if (data.credits !== undefined) setCredits(data.credits);
      else await fetchCredits();

      // Auto-save
      try {
        await fetch('/api/songs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title: data.title, topic: values.topic, genre: values.genre, mood: values.mood, language: values.language, structure: values.structure, style_tags: data.style_prompt, content: data.lyrics }),
        });
        setAutoSaved(true);
      } catch (e) { console.error('Auto-save failed:', e); }
    } catch (e) {
      setError('Generation failed — please try again');
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

  if (loading) return <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}><p style={{ color:C.muted }}>Loading…</p></div>;

  return (
    <AppShell user={user} credits={credits} onSignOut={handleSignOut}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: isMobile ? "32px 16px 60px" : "48px 24px 80px" }}>

        {/* Hero */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} style={{ marginBottom: isMobile ? 36 : 56 }}>
          <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.3em", color:C.muted, marginBottom:16 }}>
            <span style={{ color:C.gold }}>●</span> &nbsp;AI Lyric Studio
          </div>
          <h1 style={{ fontFamily:font.display, fontSize:"clamp(28px,6vw,52px)", fontWeight:400, lineHeight:1.08, letterSpacing:"-0.02em" }}>
            Write songs that <em style={{ color:C.gold, fontStyle:"normal", fontWeight:500 }}>sing</em> themselves.
          </h1>
          <p style={{ marginTop:16, fontSize:"clamp(14px,3vw,17px)", color:C.muted, lineHeight:1.6 }}>
            Generate professional lyrics for AI music generation — structured, formatted, and ready to use.
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <div style={{ background:"#fff0f0", border:`1px solid ${C.danger}33`, borderRadius:6, padding:"12px 16px", marginBottom:24, color:C.danger, fontSize:14 }}>
            {error}
            {error.includes('credits') && <a href="/dashboard" style={{ color:C.gold, marginLeft:8, textDecoration:"underline" }}>Buy credits →</a>}
          </div>
        )}

        {/* Form */}
        <div style={{ display:"flex", flexDirection:"column", gap: isMobile ? 22 : 28 }}>
          <Field label="Song Title"><TextInput value={values.title} onChange={(v:string)=>update("title",v)} placeholder="e.g. Rise Again" large /></Field>
          <Field label="Song Concept"><AreaInput value={values.topic} onChange={(v:string)=>update("topic",v)} placeholder="Describe what the song is about…" large rows={isMobile ? 3 : 4} /></Field>
          <Row>
            <Field label="Genre"><Dropdown value={values.genre} onChange={(v:string)=>update("genre",v)} options={GENRES} placeholder="Select genre" /></Field>
            <Field label="Mood"><Dropdown value={values.mood} onChange={(v:string)=>update("mood",v)} options={MOODS} placeholder="Select mood" /></Field>
          </Row>
          <Row>
            <Field label="Language"><Dropdown value={values.language} onChange={(v:string)=>update("language",v)} options={LANGUAGES} placeholder="Select language" /></Field>
            <Field label="Vocalist"><Dropdown value={values.vocalist} onChange={(v:string)=>update("vocalist",v)} options={VOCALISTS} placeholder="Select vocalist" /></Field>
          </Row>
          <Row>
            <Field label="Structure"><Dropdown value={values.structure} onChange={(v:string)=>update("structure",v)} options={STRUCTURES} placeholder="Select structure" /></Field>
            <Field label="Tempo"><Dropdown value={values.tempo} onChange={(v:string)=>update("tempo",v)} options={TEMPOS} placeholder="Select tempo" /></Field>
          </Row>

          <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap:"12px" }}>
            <Toggle label="Auto-Cues" desc="Add performance cues e.g. [whispered], [building]" checked={values.auto_cues} onChange={(v:boolean)=>update("auto_cues",v)} />
            <Toggle label="Call & Response" desc="Include [Lead] / [Crowd] call-and-response" checked={values.call_response} onChange={(v:boolean)=>update("call_response",v)} />
            <Toggle label="Metadata Header" desc="Prepend a [[metadata]] block for context" checked={values.metadata_header} onChange={(v:boolean)=>update("metadata_header",v)} />
          </div>

          <Field label="Notes (optional)">
            <AreaInput value={values.notes} onChange={(v:string)=>update("notes",v)} placeholder="Extra instructions, artist inspiration, cultural references…" rows={2} />
          </Field>

          <div style={{ paddingTop:8, display:"flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", gap:12 }}>
            <PillBtn onClick={generate} disabled={generating || !values.topic.trim() || credits <= 0} dark large>
              {generating ? "⏳ Composing…" : credits <= 0 ? "🔒 No Credits" : "✦ Generate Lyrics"}
            </PillBtn>
            <span style={{ fontSize:12, color:C.muted, textAlign: isMobile ? "center" : "left" }}>{credits} credit{credits!==1?"s":""} remaining</span>
          </div>
        </div>

        {/* Loading */}
        {generating && !result && (
          <div style={{ marginTop:48, border:`1px solid ${C.border}`, borderRadius:6, padding: isMobile ? 32 : 48, textAlign:"center" }}>
            <div style={{ width:36, height:36, border:`3px solid ${C.border}`, borderTop:`3px solid ${C.gold}`, borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 16px" }} />
            <div style={{ fontFamily:font.display, fontSize:"clamp(18px,4vw,22px)", fontStyle:"italic", color:C.muted }}>Composing your song…</div>
            <div style={{ fontSize:13, color:C.muted, marginTop:8 }}>This may take 15–30 seconds</div>
          </div>
        )}

        {/* Result */}
        {result && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            style={{ marginTop:48, background:C.card, border:`1px solid ${C.border}`, borderRadius:6, overflow:"hidden" }}>

            {/* Result header */}
            <div style={{ padding: isMobile ? "14px 16px" : "16px 24px", borderBottom:`1px solid ${C.borderLight}` }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ color:C.gold, fontSize:16 }}>✦</span>
                  <div>
                    <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.22em", color:C.muted }}>Generated</div>
                    <div style={{ fontFamily:font.display, fontSize:"clamp(16px,4vw,18px)", marginTop:2 }}>{result.title}</div>
                  </div>
                </div>
                {autoSaved && <span style={{ fontSize:11, color:C.success, textTransform:"uppercase", letterSpacing:"0.1em", whiteSpace:"nowrap" }}>✓ Saved</span>}
              </div>

              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:12 }}>
                {result.style_prompt && <SmBtn onClick={()=>copy(result.style_prompt,'style')}>{copied==='style'?'✓ Copied':'Copy Style'}</SmBtn>}
                <SmBtn onClick={()=>copy(result.lyrics,'lyrics')}>{copied==='lyrics'?'✓ Copied':'Copy Lyrics'}</SmBtn>
                <SmBtn onClick={exportTxt}>Export .txt</SmBtn>
                <SmBtn onClick={()=>router.push('/archive')}>View Archive →</SmBtn>
              </div>
            </div>

            {/* Style prompt */}
            {result.style_prompt && (
              <div style={{ padding: isMobile ? "10px 16px" : "12px 24px", borderBottom:`1px solid ${C.borderLight}`, background:"#F7F6F2" }}>
                <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.22em", color:C.muted, marginBottom:4 }}>Style Prompt</div>
                <div style={{ fontFamily:font.mono, fontSize:12, color:C.fgSoft, wordBreak:"break-word" }}>{result.style_prompt}</div>
              </div>
            )}

            {/* Lyrics */}
            <pre style={{ padding: isMobile ? "24px 16px" : "32px 24px", whiteSpace:"pre-wrap", fontFamily:font.mono, fontSize: isMobile ? 13 : 14, lineHeight:1.9, color:C.fgSoft, margin:0, wordBreak:"break-word", overflowX:"hidden" }}>
              {result.lyrics}
            </pre>

            {/* Suno affiliate banner */}
            <div style={{ margin: isMobile ? "0 16px 24px" : "0 24px 32px", padding:"20px 24px", background:`linear-gradient(135deg, ${C.fg} 0%, #2a2a28 100%)`, borderRadius:8, display:"flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent:"space-between", gap:16 }}>
              <div>
                <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.2em", color:C.gold, marginBottom:6 }}>Next Step</div>
                <div style={{ fontFamily:font.display, fontSize:"clamp(16px,3vw,18px)", color:"#fff", marginBottom:4 }}>
                  Turn these lyrics into a real song
                </div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,.6)", lineHeight:1.5 }}>
                  Paste your lyrics into Suno AI and generate a professional track in seconds.
                </div>
              </div>
              <a href={SUNO_AFFILIATE} target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-block", padding:"12px 24px", background:C.gold, color:"#fff", borderRadius:6, fontSize:13, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap", flexShrink:0, textTransform:"uppercase", letterSpacing:"0.15em" }}>
                Try Suno AI →
              </a>
            </div>

          </motion.div>
        )}
      </div>
    </AppShell>
  );
}

// ── LANDING PAGE SUNO SECTION (add to app/page.tsx) ──
// Add this section just before the <PublicFooter /> in your landing page:
//
// <div style={{ background: C.fg, padding: "4rem 1rem", textAlign: "center" }}>
//   <div style={{ maxWidth: 600, margin: "0 auto" }}>
//     <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: C.gold, marginBottom: 16 }}>Powered for</div>
//     <h2 style={{ fontFamily: font.display, fontSize: "clamp(24px,4vw,36px)", fontWeight: 400, color: "#fff", marginBottom: 16 }}>
//       Generate lyrics. Create music on Suno AI.
//     </h2>
//     <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
//       Don't have a Suno AI account yet? Sign up and start turning your lyrics into real songs.
//     </p>
//     <a href="https://www.musicapi.ai/suno-api?via=anointed-lyrics" target="_blank" rel="noopener noreferrer"
//       style={{ display: "inline-block", padding: "14px 32px", background: C.gold, color: "#fff", borderRadius: 6, fontSize: 14, fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.18em" }}>
//       Get Started with Suno AI →
//     </a>
//   </div>
// </div>
