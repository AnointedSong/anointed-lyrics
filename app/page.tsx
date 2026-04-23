'use client';
import Link from 'next/link';
import { C, font, PublicFooter } from '@/lib/components';

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: font.body, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div className="al-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: C.fg, color: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>♪</div>
            <div style={{ fontFamily: font.display, fontSize: "clamp(15px,4vw,18px)", color: C.fg }}>AnointedLyrics<span style={{ color: C.gold }}>.</span></div>
          </div>
          <Link href="/login" style={{ fontSize: 13, color: C.muted, textDecoration: "none", whiteSpace: "nowrap" }}>Sign In →</Link>
        </div>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "4rem 1rem", textAlign: "center", background: `linear-gradient(180deg,${C.bg} 0%,${C.goldLight} 100%)` }}>
        <div style={{ maxWidth: 680, width: "100%" }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: C.muted, marginBottom: 20 }}>
            <span style={{ color: C.gold }}>●</span> &nbsp;Lyric Studio for Suno AI
          </div>
          <h1 style={{ fontFamily: font.display, fontSize: "clamp(32px,7vw,68px)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.02em", color: C.fg, marginBottom: 20 }}>
            Write songs that<br /><em style={{ color: C.gold, fontStyle: "normal", fontWeight: 500 }}>sing</em> themselves.
          </h1>
          <p style={{ fontSize: "clamp(15px,4vw,18px)", color: C.muted, maxWidth: 480, margin: "0 auto 2rem", lineHeight: 1.6 }}>
            Generate professional, Suno-ready lyrics with metatags, production cues, and style prompts — in seconds.
          </p>
          <Link href="/login" style={{ display: "inline-block", padding: "1rem 2rem", background: C.fg, color: C.bg, borderRadius: 6, fontSize: "0.9375rem", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 500, textDecoration: "none" }}>
            Get Started Free
          </Link>

          {/* Stats */}
          <div style={{ display: "flex", gap: "clamp(16px,6vw,40px)", justifyContent: "center", marginTop: "3rem", flexWrap: "wrap" }}>
            {[["20+","Genres"],["11","Languages"],["6","Structures"],["∞","Creativity"]].map(([n,l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: font.display, fontSize: "clamp(22px,5vw,28px)", fontWeight: 500, color: C.gold }}>{n}</div>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
<div style={{ background: C.fg, padding: "4rem 1rem", textAlign: "center" }}>
 <div style={{ maxWidth: 600, margin: "0 auto" }}>
  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: C.gold, marginBottom: 16 }}>Powered for</div>
   <h2 style={{ fontFamily: font.display, fontSize: "clamp(24px,4vw,36px)", fontWeight: 400, color: "#fff", marginBottom: 16 }}>
  Generate lyrics. Create music on Suno AI.
   </h2>
    <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
    Don't have a Suno AI account yet? Sign up and start turning your lyrics into real songs.
    </p>
  <a href="https://www.musicapi.ai/suno-api?via=anointed-lyrics" target="_blank" rel="noopener noreferrer"
   style={{ display: "inline-block", padding: "14px 32px", background: C.gold, color: "#fff", borderRadius: 6, fontSize: 14, fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.18em" }}>
    Get Started with Suno AI →
  </a>
   </div>
</div>
      <PublicFooter />
    </div>
  );
}
