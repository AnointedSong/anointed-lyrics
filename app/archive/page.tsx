'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { AppShell, C, font, SmBtn } from '@/lib/components';
import { motion } from 'framer-motion';

export default function ArchivePage() {
  const router = useRouter();
  const { user, loading, getToken, signOut } = useAuth();
  const [credits, setCredits] = useState(0);
  const [songs, setSongs] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return; }
    if (!user) return;
    (async () => {
      const token = await getToken();
      const [credRes, songRes] = await Promise.all([
        fetch('/api/credits', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/songs', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const credData = await credRes.json();
      const songData = await songRes.json();
      setCredits(credData.credits || 0);
      setSongs(songData.songs || []);
      setDataLoading(false);
    })();
  }, [user, loading]);

  const removeSong = async (id: string) => {
    const token = await getToken();
    await fetch('/api/songs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    });
    setSongs(s => s.filter(x => x.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label); setTimeout(() => setCopied(''), 1800);
  };

  const handleSignOut = async () => { await signOut(); router.push('/login'); };

  if (loading || dataLoading) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: C.muted }}>Loading…</p></div>;

  if (selected) {
    return (
      <AppShell user={user} credits={credits} onSignOut={handleSignOut}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 80px" }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 32 }}>← Back to archive</button>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `1px solid ${C.borderLight}`, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: C.gold, fontSize: 16 }}>✦</span>
                  <div>
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted }}>Saved</div>
                    <div style={{ fontFamily: font.display, fontSize: 18, marginTop: 2 }}>{selected.title}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {selected.style_tags && <SmBtn onClick={() => copy(selected.style_tags, 'style')}>{copied === 'style' ? '✓ Copied' : 'Copy Style'}</SmBtn>}
                  <SmBtn onClick={() => copy(selected.content, 'lyrics')}>{copied === 'lyrics' ? '✓ Copied' : 'Copy Lyrics'}</SmBtn>
                </div>
              </div>
              {selected.style_tags && (
                <div style={{ padding: "12px 24px", borderBottom: `1px solid ${C.borderLight}`, background: "#F7F6F2" }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted, marginBottom: 4 }}>Suno Style Prompt</div>
                  <div style={{ fontFamily: font.mono, fontSize: 12, color: C.fgSoft }}>{selected.style_tags}</div>
                </div>
              )}
              <pre style={{ padding: "32px 24px", whiteSpace: "pre-wrap", fontFamily: font.mono, fontSize: 14, lineHeight: 1.9, color: C.fgSoft, margin: 0 }}>{selected.content}</pre>
            </div>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell user={user} credits={credits} onSignOut={handleSignOut}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: C.muted, marginBottom: 12 }}><span style={{ color: C.gold }}>●</span> &nbsp;Archive</div>
          <h1 style={{ fontFamily: font.display, fontSize: "clamp(32px,4vw,48px)", fontWeight: 400, letterSpacing: "-0.02em" }}>Your saved songs</h1>
        </div>

        {songs.length === 0 ? (
          <div style={{ border: `1px dashed ${C.border}`, borderRadius: 6, padding: 64, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: .3 }}>📄</div>
            <div style={{ fontFamily: font.display, fontSize: 20, marginBottom: 8 }}>No songs yet</div>
            <div style={{ fontSize: 14, color: C.muted }}>Generate and save lyrics to see them here.</div>
          </div>
        ) : (
          <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
            {songs.map(l => (
              <button key={l.id} onClick={() => setSelected(l)}
                style={{ width: "100%", textAlign: "left", padding: "20px 16px", background: "none", border: "none", borderBottom: `1px solid ${C.borderLight}`, cursor: "pointer", display: "grid", gridTemplateColumns: "1fr auto auto", gap: 16, alignItems: "center", color: C.fg }}>
                <div>
                  <div style={{ fontFamily: font.display, fontSize: 20, lineHeight: 1.2 }}>{l.title || "Untitled"}</div>
                  {l.topic && <div style={{ fontSize: 13, color: C.muted, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.topic}</div>}
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, marginTop: 6 }}>{[l.genre, l.mood].filter(Boolean).join(" · ")}</div>
                </div>
                <div style={{ fontSize: 11, fontFamily: font.mono, color: C.muted }}>{new Date(l.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                <button onClick={(e) => { e.stopPropagation(); removeSong(l.id); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 8, opacity: .3, fontSize: 14 }}
                  onMouseEnter={(e: any) => e.target.style.opacity = 1} onMouseLeave={(e: any) => e.target.style.opacity = .3}>🗑</button>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
