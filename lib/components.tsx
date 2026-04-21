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

/* ══════════════════════════════════════
   APP SHELL (authenticated pages)
   ══════════════════════════════════════ */
export function AppShell({ children, user, credits, onSignOut }: {
  children: React.ReactNode; user: any; credits: number; onSignOut: () => void;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/generator", label: "Generator" },
    { href: "/archive", label: "Archive" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.fg, fontFamily: font.body, display: "flex", flexDirection: "column" }}>
     <header style={{ borderBottom: `1px solid ${C.border}`, background: C.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <div className="al-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 1rem" }}>
          {/* Logo */}
          <Link href="/generator" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: C.fg }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: C.fg, color: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>♪</div>
            <div>
              <div style={{ fontFamily: font.display, fontSize: "clamp(15px, 4vw, 18px)", letterSpacing: "-0.01em", lineHeight: 1 }}>
                AnointedLyrics<span style={{ color: C.gold }}>.</span>
              </div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, marginTop: 2 }}>Suno Lyric Studio</div>
            </div>
          </Link>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Credits badge */}
            <div style={{ padding: "4px 10px", background: C.goldLight, borderRadius: 20, fontSize: 12, fontWeight: 600, color: C.goldDark, fontFamily: font.mono, whiteSpace: "nowrap" }}>
              {credits} ✦
            </div>

            {/* Desktop nav */}
            <nav className="al-nav-links" style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {navItems.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href}
                    style={{ padding: "8px 12px", fontSize: 13, color: active ? C.fg : C.muted, textDecoration: "none", position: "relative", fontWeight: active ? 500 : 400, whiteSpace: "nowrap" }}>
                    {label}
                    {active && <span style={{ position: "absolute", left: 12, right: 12, bottom: -1, height: 2, background: C.gold, borderRadius: 1 }} />}
                  </Link>
                );
              })}
              <button onClick={onSignOut}
                style={{ padding: "8px 12px", fontSize: 13, color: C.muted, background: "none", border: "none", cursor: "pointer", fontFamily: font.body }}>
                Sign Out
              </button>
            </nav>

            {/* Hamburger */}
            <button
              className="al-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", gap: 5 }}
              aria-label="Menu">
              <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? C.gold : C.fg, transition: "all .2s", transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none" }} />
              <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? C.gold : C.fg, transition: "all .2s", opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: "block", width: 22, height: 2, background: menuOpen ? C.gold : C.fg, transition: "all .2s", transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none" }} />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
            {navItems.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                  style={{ display: "block", padding: "14px 1.5rem", fontSize: 15, color: active ? C.fg : C.muted, textDecoration: "none", borderBottom: `1px solid ${C.borderLight}`, fontWeight: active ? 500 : 400, background: active ? C.goldLight : "transparent" }}>
                  {label}
                </Link>
              );
            })}
            <button onClick={() => { onSignOut(); setMenuOpen(false); }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "14px 1.5rem", fontSize: 15, color: C.muted, background: "none", border: "none", cursor: "pointer", borderBottom: `1px solid ${C.borderLight}`, fontFamily: font.body }}>
              Sign Out
            </button>
          </div>
        )}
      </header>

      <main style={{ flex: 1 }}>{children}</main>
      <AppFooter />
    </div>
  );
}

/* ══════════════════════════════════════
   FOOTERS
   ══════════════════════════════════════ */
export function AppFooter() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
      <div className="al-container" style={{ padding: "1.5rem 1rem" }}>
        <div className="al-footer-inner">
          <div>
            <div style={{ fontFamily: font.display, fontSize: 15 }}>AnointedLyrics<span style={{ color: C.gold }}>.</span></div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>© {YEAR} AnointedLyrics. All rights reserved.</div>
          </div>
          <div className="al-footer-links">
            {[["/terms","Terms"],["/privacy","Privacy"],["/refunds","Refunds"]].map(([href,label]) => (
              <Link key={href} href={href} style={{ fontSize: 12, color: C.muted, textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PublicFooter() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, background: C.bg }}>
      <div className="al-container" style={{ padding: "1.5rem 1rem" }}>
        <div className="al-footer-inner">
          <div>
            <div style={{ fontFamily: font.display, fontSize: 15 }}>AnointedLyrics<span style={{ color: C.gold }}>.</span></div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>© {YEAR} AnointedLyrics. All rights reserved.</div>
          </div>
          <div className="al-footer-links">
            {[["/terms","Terms"],["/privacy","Privacy"],["/refunds","Refunds"]].map(([href,label]) => (
              <Link key={href} href={href} style={{ fontSize: 12, color: C.muted, textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════
   LEGAL LAYOUT
   ══════════════════════════════════════ */
export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: font.body, display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div className="al-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 1rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: C.fg }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: C.fg, color: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>♪</div>
            <div style={{ fontFamily: font.display, fontSize: 16 }}>AnointedLyrics<span style={{ color: C.gold }}>.</span></div>
          </Link>
          <Link href="/login" style={{ fontSize: 13, color: C.muted, textDecoration: "none" }}>Sign In →</Link>
        </div>
      </header>
      <main style={{ flex: 1 }}>
        <div className="al-container-md" style={{ padding: "3rem 1rem 4rem" }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: C.muted, marginBottom: 12 }}>
            <span style={{ color: C.gold }}>●</span> &nbsp;Legal
          </div>
          <h1 style={{ fontFamily: font.display, fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8 }}>{title}</h1>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 40 }}>
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <div className="al-legal-content">{children}</div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

/* ══════════════════════════════════════
   SHARED UI PRIMITIVES
   ══════════════════════════════════════ */
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted, fontFamily: font.body }}>{label}</label>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="al-grid-2">{children}</div>;
}

export function TextInput({ value, onChange, placeholder, large }: any) {
  return <input value={value} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder}
    style={{ width: "100%", border: "none", borderBottom: `1px solid ${C.border}`, background: "transparent", padding: "0.5rem 0", fontSize: large ? "clamp(16px, 4vw, 18px)" : "0.9375rem", fontFamily: large ? font.display : font.body, color: C.fg, outline: "none", WebkitAppearance: "none" }}
    onFocus={(e: any) => e.target.style.borderColor = C.fg} onBlur={(e: any) => e.target.style.borderColor = C.border} />;
}

export function AreaInput({ value, onChange, placeholder, rows, large }: any) {
  return <textarea value={value} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder} rows={rows || 3}
    style={{ width: "100%", border: "none", borderBottom: `1px solid ${C.border}`, background: "transparent", padding: "0.5rem 0", fontSize: large ? "clamp(16px, 4vw, 20px)" : "0.9375rem", fontFamily: large ? font.display : font.body, color: C.fg, outline: "none", resize: "none", lineHeight: 1.6 }}
    onFocus={(e: any) => e.target.style.borderColor = C.fg} onBlur={(e: any) => e.target.style.borderColor = C.border} />;
}

export function Dropdown({ value, onChange, options, placeholder }: any) {
  return <select value={value} onChange={(e: any) => onChange(e.target.value)}
    style={{ width: "100%", border: "none", borderBottom: `1px solid ${C.border}`, background: "transparent", padding: "0.5rem 0", fontSize: "0.9375rem", fontFamily: font.body, color: value ? C.fg : C.muted, outline: "none", cursor: "pointer", appearance: "none" as any, WebkitAppearance: "none" as any,
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%23908E85' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat", backgroundPosition: "right 4px center" }}>
    <option value="">{placeholder}</option>
    {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
  </select>;
}

export function Toggle({ label, desc, checked, onChange }: any) {
  return <button type="button" onClick={() => onChange(!checked)}
    style={{ textAlign: "left", border: `1px solid ${checked ? C.fg : C.border}`, borderRadius: 6, padding: "0.875rem 1rem", background: checked ? "rgba(28,27,24,.03)" : "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between", gap: 12, color: C.fg, width: "100%" }}>
    <div>
      <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: "0.75rem", color: C.muted, marginTop: 4, lineHeight: 1.4 }}>{desc}</div>
    </div>
    <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${checked ? C.fg : C.border}`, background: checked ? C.fg : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
      {checked && <span style={{ color: "#fff", fontSize: 10 }}>✓</span>}
    </div>
  </button>;
}

export function PillBtn({ onClick, disabled, dark, large, full, children }: any) {
  return <button onClick={onClick} disabled={disabled}
    style={{ padding: large ? "0.875rem 2rem" : "0.625rem 1.25rem", background: disabled ? C.muted : dark ? C.fg : "transparent", color: dark || disabled ? C.bg : C.fg,
      border: dark ? "none" : `1px solid ${C.border}`, borderRadius: 6, fontSize: large ? "0.9375rem" : "0.8125rem", textTransform: "uppercase" as any, letterSpacing: "0.18em",
      fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, width: full ? "100%" : "auto", fontFamily: font.body, WebkitAppearance: "none" as any }}>
    {children}
  </button>;
}

export function SmBtn({ onClick, disabled, dark, children }: any) {
  return <button onClick={onClick} disabled={disabled}
    style={{ padding: "0.375rem 0.875rem", fontSize: "0.6875rem", textTransform: "uppercase" as any, letterSpacing: "0.15em", background: dark ? C.fg : "transparent", color: dark ? C.bg : C.fg,
      border: dark ? "none" : `1px solid ${C.border}`, borderRadius: 4, cursor: disabled ? "not-allowed" : "pointer", fontWeight: 500, opacity: disabled ? 0.5 : 1, fontFamily: font.body, whiteSpace: "nowrap" as any }}>
    {children}
  </button>;
}
