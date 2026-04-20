'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const C = {
  bg: "#FAF9F7", card: "#FFFFFF", border: "#E5E3DD", borderLight: "#F0EDE8",
  fg: "#1C1B18", fgSoft: "rgba(28,27,24,.78)", muted: "#908E85",
  gold: "#C6A24B", goldLight: "#F6EDCE", goldDark: "#A6842E",
  danger: "#C24B4B", success: "#4BA368", inputBg: "#FAFAF8",
};

export const font = {
  display: "'Playfair Display','Georgia',serif",
  body: "'DM Sans','Helvetica Neue',sans-serif",
  mono: "'JetBrains Mono','Menlo',monospace",
};

const YEAR = new Date().getFullYear();

export function AppShell({ children, user, credits, onSignOut }: {
  children: React.ReactNode; user: any; credits: number; onSignOut: () => void;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.fg, fontFamily: font.body, display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: `1px solid ${C.border}`, background: C.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/generator" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: C.fg }}>
            <div style={{ width: 34, height: 34, borderRadius: 6, background: C.fg, color: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>♪</div>
            <div>
              <div style={{ fontFamily: font.display, fontSize: 18, letterSpacing: "-0.01em", lineHeight: 1 }}>AnointedLyrics<span style={{ color: C.gold }}>.</span></div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, marginTop: 2 }}>Suno Lyric Studio</div>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[
              ["/dashboard", "Dashboard"],
              ["/generator", "Generator"],
              ["/archive", "Archive"],
            ].map(([href, label]) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  style={{ padding: "8px 14px", fontSize: 13, color: active ? C.fg : C.muted, textDecoration: "none", position: "relative", fontWeight: active ? 500 : 400 }}>
                  {label}
                  {active && <span style={{ position: "absolute", left: 14, right: 14, bottom: -1, height: 2, background: C.gold, borderRadius: 1 }} />}
                </Link>
              );
            })}

            <div style={{ marginLeft: 8, padding: "5px 12px", background: C.goldLight, borderRadius: 20, fontSize: 12, fontWeight: 600, color: C.goldDark, fontFamily: font.mono }}>
              {credits} ✦
            </div>

            <div style={{ position: "relative", marginLeft: 4 }}>
              <button onClick={() => setMenuOpen(!menuOpen)}
                style={{ width: 32, height: 32, borderRadius: "50%", background: C.fg, color: C.bg, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                {user?.email?.[0]?.toUpperCase() || "U"}
              </button>
              {menuOpen && (
                <div style={{ position: "absolute", right: 0, top: 40, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, minWidth: 180, boxShadow: "0 8px 32px rgba(0,0,0,.1)", zIndex: 200 }}>
                  <div style={{ padding: "8px 12px", fontSize: 13, color: C.muted, borderBottom: `1px solid ${C.borderLight}`, marginBottom: 4 }}>{user?.email}</div>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "8px 12px", fontSize: 13, color: C.fg, textDecoration: "none", borderRadius: 4 }}>Dashboard</Link>
                  <button onClick={() => { onSignOut(); setMenuOpen(false); }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 13, color: C.fg, borderRadius: 4 }}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <AppFooter />
    </div>
  );
}

export function AppFooter() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, background: C.bg, marginTop: "auto" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: font.display, fontSize: 16, letterSpacing: "-0.01em" }}>
              AnointedLyrics<span style={{ color: C.gold }}>.</span>
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
              © {YEAR} AnointedLyrics. All rights reserved.
            </div>
          </div>

          {/* Legal links */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              ["/terms", "Terms & Conditions"],
              ["/privacy", "Privacy Policy"],
              ["/refunds", "Refund Policy"],
            ].map(([href, label]) => (
              <Link key={href} href={href}
                style={{ fontSize: 12, color: C.muted, textDecoration: "none" }}
                onMouseEnter={(e: any) => e.target.style.color = C.fg}
                onMouseLeave={(e: any) => e.target.style.color = C.muted}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Public footer for landing/legal pages */
export function PublicFooter() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div>
            <div style={{ fontFamily: font.display, fontSize: 16 }}>
              AnointedLyrics<span style={{ color: C.gold }}>.</span>
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
              © {YEAR} AnointedLyrics. All rights reserved.
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              ["/terms", "Terms & Conditions"],
              ["/privacy", "Privacy Policy"],
              ["/refunds", "Refund Policy"],
            ].map(([href, label]) => (
              <Link key={href} href={href}
                style={{ fontSize: 12, color: C.muted, textDecoration: "none" }}
                onMouseEnter={(e: any) => e.target.style.color = C.fg}
                onMouseLeave={(e: any) => e.target.style.color = C.muted}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Shared UI primitives ── */
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted, fontFamily: font.body }}>{label}</label>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>{children}</div>;
}

export function TextInput({ value, onChange, placeholder, large }: any) {
  return <input value={value} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder}
    style={{ width: "100%", border: "none", borderBottom: `1px solid ${C.border}`, background: "transparent", padding: "8px 0", fontSize: large ? 18 : 14, fontFamily: large ? font.display : font.body, color: C.fg, outline: "none" }}
    onFocus={(e: any) => e.target.style.borderColor = C.fg} onBlur={(e: any) => e.target.style.borderColor = C.border} />;
}

export function AreaInput({ value, onChange, placeholder, rows, large }: any) {
  return <textarea value={value} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder} rows={rows || 3}
    style={{ width: "100%", border: "none", borderBottom: `1px solid ${C.border}`, background: "transparent", padding: "8px 0", fontSize: large ? 20 : 14, fontFamily: large ? font.display : font.body, color: C.fg, outline: "none", resize: "none", lineHeight: 1.6 }}
    onFocus={(e: any) => e.target.style.borderColor = C.fg} onBlur={(e: any) => e.target.style.borderColor = C.border} />;
}

export function Dropdown({ value, onChange, options, placeholder }: any) {
  return <select value={value} onChange={(e: any) => onChange(e.target.value)}
    style={{ width: "100%", border: "none", borderBottom: `1px solid ${C.border}`, background: "transparent", padding: "8px 0", fontSize: 14, color: value ? C.fg : C.muted, outline: "none", cursor: "pointer", appearance: "none" as any,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%23908E85' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat", backgroundPosition: "right 0 center" }}>
    <option value="">{placeholder}</option>
    {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
  </select>;
}

export function Toggle({ label, desc, checked, onChange }: any) {
  return <button type="button" onClick={() => onChange(!checked)}
    style={{ textAlign: "left", border: `1px solid ${checked ? C.fg : C.border}`, borderRadius: 6, padding: "14px 16px", background: checked ? "rgba(28,27,24,.03)" : "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between", gap: 12, color: C.fg, width: "100%" }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.4 }}>{desc}</div>
    </div>
    <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checked ? C.fg : C.border}`, background: checked ? C.fg : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
      {checked && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
    </div>
  </button>;
}

export function PillBtn({ onClick, disabled, dark, large, full, children }: any) {
  return <button onClick={onClick} disabled={disabled}
    style={{ padding: large ? "15px 32px" : "10px 20px", background: disabled ? C.muted : dark ? C.fg : "transparent", color: dark || disabled ? C.bg : C.fg,
      border: dark ? "none" : `1px solid ${C.border}`, borderRadius: 6, fontSize: large ? 14 : 13, textTransform: "uppercase" as any, letterSpacing: "0.18em",
      fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, width: full ? "100%" : "auto" }}>
    {children}
  </button>;
}

export function SmBtn({ onClick, disabled, dark, children }: any) {
  return <button onClick={onClick} disabled={disabled}
    style={{ padding: "6px 14px", fontSize: 11, textTransform: "uppercase" as any, letterSpacing: "0.15em", background: dark ? C.fg : "transparent", color: dark ? C.bg : C.fg,
      border: dark ? "none" : `1px solid ${C.border}`, borderRadius: 4, cursor: disabled ? "not-allowed" : "pointer", fontWeight: 500, opacity: disabled ? 0.5 : 1 }}>
    {children}
  </button>;
}

export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: font.body, display: "flex", flexDirection: "column" }}>
      {/* Public header */}
      <header style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: C.fg }}>
            <div style={{ width: 34, height: 34, borderRadius: 6, background: C.fg, color: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>♪</div>
            <div style={{ fontFamily: font.display, fontSize: 18, letterSpacing: "-0.01em" }}>AnointedLyrics<span style={{ color: C.gold }}>.</span></div>
          </Link>
          <Link href="/login" style={{ fontSize: 13, color: C.muted, textDecoration: "none" }}>Sign In →</Link>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 24px 80px" }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: C.muted, marginBottom: 16 }}>
            <span style={{ color: C.gold }}>●</span> &nbsp;Legal
          </div>
          <h1 style={{ fontFamily: font.display, fontSize: "clamp(32px,4vw,48px)", fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8 }}>{title}</h1>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 48 }}>Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
          <div style={{ fontSize: 15, lineHeight: 1.8, color: C.fgSoft }}>{children}</div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
