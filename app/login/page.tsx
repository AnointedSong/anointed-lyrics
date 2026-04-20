'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { C, font, PillBtn } from '@/lib/components';
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
      if (mode === 'login') await signInWithEmail(email, password);
      else await signUpWithEmail(email, password);
      router.push('/dashboard');
    } catch (e: any) { setError(e.message); setBusy(false); }
  };

  if (loading) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: C.muted }}>Loading…</p></div>;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: C.bg, fontFamily: font.body }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <Link href="/" style={{ color: C.muted, fontSize: 13, textDecoration: "none", letterSpacing: "0.1em", display: "block", marginBottom: 32 }}>← Back</Link>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontFamily: font.display, fontSize: 32, letterSpacing: "-0.02em" }}>AnointedLyrics<span style={{ color: C.gold }}>.</span></div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, marginTop: 6 }}>
            {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
          </div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 32 }}>
          <button onClick={handleGoogle} disabled={busy}
            style={{ width: "100%", padding: "12px 20px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 14, cursor: "pointer", fontWeight: 500, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: C.fg }}>
            <span style={{ fontSize: 18 }}>G</span> Continue with Google
          </button>

          <div style={{ textAlign: "center", color: C.muted, fontSize: 12, margin: "20px 0", position: "relative" }}>
            <span style={{ background: C.card, padding: "0 12px", position: "relative", zIndex: 1 }}>or</span>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: C.border }} />
          </div>

          {error && <div style={{ color: C.danger, fontSize: 13, marginBottom: 12 }}>{error}</div>}

          {mode === 'signup' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, display: "block", marginBottom: 6 }}>Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                style={{ width: "100%", padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 14, background: C.inputBg, outline: "none" }} />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, display: "block", marginBottom: 6 }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" type="email"
              onKeyDown={e => e.key === 'Enter' && handleEmail()}
              style={{ width: "100%", padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 14, background: C.inputBg, outline: "none" }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, display: "block", marginBottom: 6 }}>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleEmail()}
              style={{ width: "100%", padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 14, background: C.inputBg, outline: "none" }} />
          </div>

          <PillBtn onClick={handleEmail} disabled={busy} dark full>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </PillBtn>

          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            style={{ background: "none", border: "none", color: C.gold, fontSize: 13, marginTop: 16, cursor: "pointer", width: "100%", textAlign: "center" }}>
            {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 20 }}>3 free credits on signup · No card required</p>
      </div>
    </div>
  );
}
