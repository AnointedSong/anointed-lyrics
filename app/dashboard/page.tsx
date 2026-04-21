'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { AppShell, C, font } from '@/lib/components';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, getToken, signOut } = useAuth();
  const [credits, setCredits] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return; }
    if (!user) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setSuccessMsg('Credits purchased successfully!');
      window.history.replaceState({}, '', '/dashboard');
    }

    (async () => {
      const token = await getToken();
      const res = await fetch('/api/credits', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setCredits(data.credits || 0);
      setDataLoading(false);
    })();
  }, [user, loading]);

  const buyCredits = async (priceId: string) => {
    setBuying(true);
    const token = await getToken();
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { alert('Checkout failed'); setBuying(false); }
  };

  const handleSignOut = async () => { await signOut(); router.push('/login'); };

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Songwriter';

  if (loading || dataLoading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: C.muted }}>Loading…</p>
    </div>
  );

  return (
    <AppShell user={user} credits={credits} onSignOut={handleSignOut}>
      <div className="al-container" style={{ padding: "2.5rem 1rem 4rem" }}>
        {/* Welcome */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: C.muted, marginBottom: 10 }}>
            <span style={{ color: C.gold }}>●</span> &nbsp;Dashboard
          </div>
          <h1 style={{ fontFamily: font.display, fontSize: "clamp(24px,5vw,40px)", fontWeight: 400, letterSpacing: "-0.02em" }}>
            Welcome back, <span style={{ color: C.gold }}>{firstName}</span>
          </h1>
        </div>

        {successMsg && (
          <div style={{ background: "#1a2a1a", border: "1px solid #2a4a2a", borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "#6bff6b", fontSize: 14 }}>✓ {successMsg}</div>
        )}

        {/* Stats */}
        <div className="al-grid-stats" style={{ marginBottom: "1.5rem" }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.25rem" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted, marginBottom: 8 }}>Credits</div>
            <div style={{ fontFamily: font.display, fontSize: "clamp(28px,6vw,36px)", fontWeight: 500, color: C.gold }}>{credits} ✦</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.25rem" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted, marginBottom: 8 }}>Account</div>
            <div style={{ fontSize: 14, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{firstName}</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="al-action-cards" style={{ marginBottom: "2rem" }}>
          <button onClick={() => router.push('/generator')}
            style={{ background: C.fg, border: "none", borderRadius: 8, padding: "1.5rem 1rem", cursor: "pointer", textAlign: "left", color: C.bg, fontFamily: font.body }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>✦</div>
            <div style={{ fontFamily: font.display, fontSize: "clamp(16px,4vw,18px)", fontWeight: 500 }}>Create Song</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Generate Suno-ready lyrics</div>
          </button>
          <button onClick={() => router.push('/archive')}
            style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.5rem 1rem", cursor: "pointer", textAlign: "left", color: C.fg, fontFamily: font.body }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>📜</div>
            <div style={{ fontFamily: font.display, fontSize: "clamp(16px,4vw,18px)", fontWeight: 500 }}>View Archive</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Your saved songs</div>
          </button>
        </div>

        {/* Buy credits */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.5rem" }}>
          <h2 style={{ fontFamily: font.display, fontSize: "clamp(18px,4vw,22px)", fontWeight: 400, marginBottom: 6 }}>Buy Credits</h2>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 20, lineHeight: 1.5 }}>Each credit generates one complete song with lyrics and style prompt.</p>

          <div className="al-grid-3">
            {[
              { n: 50, price: "$9.99", per: "$0.20/song", id: process.env.NEXT_PUBLIC_STRIPE_PRICE_50 || '' },
              { n: 150, price: "$17.99", per: "$0.12/song", id: process.env.NEXT_PUBLIC_STRIPE_PRICE_150 || '', popular: true },
              { n: 300, price: "$29.99", per: "$0.10/song", id: process.env.NEXT_PUBLIC_STRIPE_PRICE_300 || '' },
            ].map(p => (
              <button key={p.n} onClick={() => buyCredits(p.id)} disabled={buying}
                style={{ background: C.inputBg, border: `1.5px solid ${p.popular ? C.gold : C.border}`, borderRadius: 8, padding: "1.25rem 0.75rem", cursor: buying ? "not-allowed" : "pointer", textAlign: "center", position: "relative", color: C.fg, fontFamily: font.body, width: "100%" }}>
                {p.popular && (
                  <span style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: C.gold, color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 10px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>Popular</span>
                )}
                <div style={{ fontFamily: font.display, fontSize: "clamp(16px,3vw,18px)", fontWeight: 500 }}>{p.n} Credits</div>
                <div style={{ fontSize: "clamp(18px,4vw,22px)", fontWeight: 700, margin: "6px 0" }}>{p.price}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{p.per}</div>
              </button>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 16 }}>Secure payment via Stripe · Card & PayPal</p>
        </div>
      </div>
    </AppShell>
  );
}
