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
  const [buying, setBuying] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Songwriter';

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return; }
    if (!user) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setSuccessMsg('Credits purchased successfully! They will appear in your account shortly.');
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

  const buyCredits = async (priceId: string, packName: string) => {
    setBuying(packName);
    try {
      const token = await getToken();
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { alert('Checkout failed. Please try again.'); setBuying(null); }
    } catch (e) {
      alert('Checkout error. Please try again.');
      setBuying(null);
    }
  };

  const handleSignOut = async () => { await signOut(); router.push('/login'); };

  if (loading || dataLoading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: C.muted }}>Loading…</p>
    </div>
  );

  const packs = [
    {
      name: "Starter",
      credits: 100,
      price: "$4.99",
      perCredit: "$0.05/song",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_100 || '',
      desc: "Perfect for trying out",
      popular: false,
    },
    {
      name: "Creator",
      credits: 250,
      price: "$10.99",
      perCredit: "$0.044/song",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_250 || '',
      desc: "Best value — beats the competition",
      popular: true,
    },
    {
      name: "Pro",
      credits: 500,
      price: "$18.99",
      perCredit: "$0.038/song",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_500 || '',
      desc: "For serious songwriters",
      popular: false,
    },
  ];

  return (
    <AppShell user={user} credits={credits} onSignOut={handleSignOut}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1rem 4rem" }}>

        {/* Welcome */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: C.muted, marginBottom: 10 }}>
            <span style={{ color: C.gold }}>●</span> &nbsp;Dashboard
          </div>
          <h1 style={{ fontFamily: font.display, fontSize: "clamp(24px,5vw,40px)", fontWeight: 400, letterSpacing: "-0.02em" }}>
            Welcome back, <span style={{ color: C.gold }}>{firstName}</span>
          </h1>
        </div>

        {/* Success message */}
        {successMsg && (
          <div style={{ background: "#1a2a1a", border: "1px solid #2a4a2a", borderRadius: 8, padding: "12px 16px", marginBottom: 24, color: "#6bff6b", fontSize: 14 }}>
            ✓ {successMsg}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.25rem" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted, marginBottom: 8 }}>Credits Remaining</div>
            <div style={{ fontFamily: font.display, fontSize: "clamp(28px,6vw,36px)", fontWeight: 500, color: C.gold }}>{credits} ✦</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.25rem" }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted, marginBottom: 8 }}>Account</div>
            <div style={{ fontSize: 15, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{firstName}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>3 free credits on signup</div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
          <button onClick={() => router.push('/generator')}
            style={{ background: C.fg, border: "none", borderRadius: 8, padding: "1.5rem 1rem", cursor: "pointer", textAlign: "left", color: C.bg, fontFamily: font.body }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>✦</div>
            <div style={{ fontFamily: font.display, fontSize: "clamp(15px,3vw,18px)", fontWeight: 500 }}>Create Song</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Generate Suno-ready lyrics</div>
          </button>
          <button onClick={() => router.push('/archive')}
            style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.5rem 1rem", cursor: "pointer", textAlign: "left", color: C.fg, fontFamily: font.body }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>📜</div>
            <div style={{ fontFamily: font.display, fontSize: "clamp(15px,3vw,18px)", fontWeight: 500 }}>View Archive</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Your saved songs</div>
          </button>
        </div>

        {/* Credit packs */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.5rem" }}>
          <h2 style={{ fontFamily: font.display, fontSize: "clamp(18px,4vw,22px)", fontWeight: 400, marginBottom: 6 }}>Buy Credits</h2>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 1.5 }}>
            Each credit generates one complete song with lyrics and Suno style prompt.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {packs.map(p => (
              <div key={p.name} style={{ position: "relative" }}>
                {p.popular && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: C.gold, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 12px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.1em", whiteSpace: "nowrap", zIndex: 1 }}>
                    Best Value
                  </div>
                )}
                <button
                  onClick={() => buyCredits(p.priceId, p.name)}
                  disabled={buying !== null}
                  style={{
                    width: "100%", background: p.popular ? C.fg : C.inputBg,
                    border: `2px solid ${p.popular ? C.fg : C.border}`,
                    borderRadius: 8, padding: "1.5rem 1rem", cursor: buying ? "not-allowed" : "pointer",
                    textAlign: "center", color: p.popular ? C.bg : C.fg,
                    fontFamily: font.body, transition: "all .2s",
                    opacity: buying && buying !== p.name ? 0.6 : 1,
                  }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.7, marginBottom: 8 }}>{p.name}</div>
                  <div style={{ fontFamily: font.display, fontSize: "clamp(18px,4vw,22px)", fontWeight: 500 }}>{p.credits} Credits</div>
                  <div style={{ fontSize: "clamp(22px,5vw,28px)", fontWeight: 700, margin: "8px 0" }}>{p.price}</div>
                  <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 12 }}>{p.perCredit}</div>
                  <div style={{ fontSize: 12, opacity: 0.7, fontStyle: "italic" }}>{p.desc}</div>
                  <div style={{ marginTop: 16, padding: "8px 0", background: p.popular ? "rgba(255,255,255,.15)" : C.gold + "22", borderRadius: 6, fontSize: 13, fontWeight: 600, color: p.popular ? C.bg : C.goldDark }}>
                    {buying === p.name ? "Redirecting…" : "Buy Now"}
                  </div>
                </button>
              </div>
            ))}
          </div>

          {/* Comparison callout */}
          <div style={{ marginTop: 20, padding: "12px 16px", background: C.goldLight, borderRadius: 6, fontSize: 13, color: C.goldDark, textAlign: "center" }}>
            💡 250 credits for $10.99 — cheaper than SongGhost's $12.00 for the same amount
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 16 }}>
            Secure payment via Stripe · Card & PayPal accepted
          </p>
        </div>
      </div>
    </AppShell>
  );
}
