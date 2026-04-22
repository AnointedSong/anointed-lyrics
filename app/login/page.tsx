'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { C, font, PillBtn, PublicFooter } from '@/lib/components';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!loading && user) router.push('/dashboard');
  }, [user, loading, router]);

  const handleGoogle = async () => {
    setBusy(true); setError('');
    try { await signInWithGoogle(); }
    catch (e: any) { setError(e.message); setBusy(false); }
  };

  const handleEmail = async () => {
    if (!email.trim() || !password.trim()) { setError('Email and password required'); return; }
    setBusy(true); setError('');
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
        router.push('/dashboard');
      } else {
        await signUpWithEmail(email, password);
        setEmailSent(true);
        setBusy(false);
      }
    } catch (e: any) { setError(e.message); setBusy(false); }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: C.muted }}>Loading…</p>
    </div>
  );

  const inputStyle = {
    width: "100%", padding: "0.75rem 0.875rem",
    border: `1px solid ${C.border}`, borderRadius: 6,
    fontSize: "1rem", background: C.inputBg, outline: "none",
    fontFamily: font.body, color: C.fg,
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: font.body, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: C.fg }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, background: C.fg, color: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>♪</div>
            <div style={{ fontFamily: font.display, fontSize: 16 }}>AnointedLyrics<span style={{ color: C.gold }}>.</span></div>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Logo + title */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontFamily: font.display, fontSize: "clamp(24px,5vw,32px)", letterSpacing: "-0.02em", marginBottom: 8 }}>
              AnointedLyrics<span style={{ color: C.gold }}>.</span>
            </h1>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted }}>
              {emailSent ? "Almost there!" : mode === 'login' ? 'Sign in to continue' : 'Create your account'}
            </div>
          </div>

          {/* Email confirmation screen */}
          {emailSent ? (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "2rem", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
              <h2 style={{ fontFamily: font.display, fontSize: 22, fontWeight: 400, marginBottom: 12, color: C.fg }}>
                Check your email
              </h2>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
                We sent a confirmation link to{' '}
                <strong style={{ color: C.fg }}>{email}</strong>.{' '}
                Click the link to activate your account and receive your <strong style={{ color: C.gold }}>3 free credits</strong>.
              </p>
              <div style={{ background: C.goldLight, border: `1px solid ${C.gold}33`, borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: C.goldDark }}>
                💡 Don't forget to check your spam or junk folder
              </div>
              <button onClick={() => { setEmailSent(false); setMode('login'); }}
                style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", fontSize: 13, textDecoration: "underline", fontFamily: font.body }}>
                Already confirmed? Sign in here
              </button>
            </div>
          ) : (
            /* Login / Signup card */
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "1.5rem" }}>

              {/* Google button */}
              <button onClick={handleGoogle} disabled={busy}
                style={{ width: "100%", padding: "0.875rem 1.25rem", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: "0.9375rem", cursor: "pointer", fontWeight: 500, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: C.fg, fontFamily: font.body }}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>G</span> Continue with Google
              </button>

              {/* Divider */}
              <div style={{ textAlign: "center", color: C.muted, fontSize: 12, margin: "16px 0", position: "relative" }}>
                <span style={{ background: C.card, padding: "0 12px", position: "relative", zIndex: 1 }}>or</span>
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: C.border }} />
              </div>

              {/* Error */}
              {error && (
                <div style={{ color: C.danger, fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "#fff0f0", borderRadius: 6 }}>
                  {error}
                </div>
              )}

              {/* Name field (signup only) */}
              {mode === 'signup' && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, display: "block", marginBottom: 6 }}>Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
                </div>
              )}

              {/* Email */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, display: "block", marginBottom: 6 }}>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" type="email"
                  onKeyDown={e => e.key === 'Enter' && handleEmail()} style={inputStyle} />
              </div>

              {/* Password */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, display: "block", marginBottom: 6 }}>Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••"
                  onKeyDown={e => e.key === 'Enter' && handleEmail()} style={inputStyle} />
              </div>

              {/* Submit button */}
              <PillBtn onClick={handleEmail} disabled={busy} dark full>
                {busy ? "Please wait…" : mode === 'login' ? 'Sign In' : 'Create Account'}
              </PillBtn>

              {/* Toggle mode */}
              <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
                style={{ background: "none", border: "none", color: C.gold, fontSize: 13, marginTop: 16, cursor: "pointer", width: "100%", textAlign: "center", fontFamily: font.body }}>
                {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>
            </div>
          )}

          <p style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 16 }}>
            3 free credits on signup · No card required
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}