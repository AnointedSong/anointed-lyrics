'use client';
import Link from 'next/link';
import { C, font } from '@/lib/components';

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 24px", textAlign: "center", background: `linear-gradient(180deg,${C.bg} 0%,${C.goldLight} 100%)`, fontFamily: font.body }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center", marginBottom: 48 }}>
        <div style={{ width: 48, height: 48, borderRadius: 8, background: C.fg, color: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>♪</div>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: font.display, fontSize: 28, letterSpacing: "-0.02em" }}>AnointedLyrics<span style={{ color: C.gold }}>.</span></div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.25em", color: C.muted, marginTop: 2 }}>Suno Lyric Studio</div>
        </div>
      </div>

      <h1 style={{ fontFamily: font.display, fontSize: "clamp(40px,6vw,72px)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 700 }}>
        Write songs that<br /><em style={{ color: C.gold, fontStyle: "normal", fontWeight: 500 }}>sing</em> themselves.
      </h1>
      <p style={{ marginTop: 24, fontSize: 18, color: C.muted, maxWidth: 500, lineHeight: 1.6 }}>
        Generate professional, Suno-ready lyrics with metatags, production cues, and style prompts — in seconds.
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
        <Link href="/login" style={{
          padding: "15px 32px", background: C.fg, color: C.bg, borderRadius: 6, fontSize: 14,
          textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 500, textDecoration: "none"
        }}>
          Get Started Free
        </Link>
      </div>

      <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
        {[["20+", "Genres"], ["11", "Languages"], ["6", "Structures"], ["∞", "Creativity"]].map(([n, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: font.display, fontSize: 28, fontWeight: 500, color: C.gold }}>{n}</div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
