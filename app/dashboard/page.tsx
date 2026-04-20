'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { AppShell, C, font, PillBtn } from '@/lib/components';

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

  if (loading || dataLoading) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: C.muted }}>Loading…</p></div>;

  return (
    <AppShell user={user} credits={credits} onSignOut={handleSignOut}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: C.muted, marginBottom: 12 }}>
            <span style={{ color: C.gold }}>●</span> &nbsp;Dashboard
          </div>
          <h1 style={{ fontFamily: font.display, fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, letterSpacing: "-0.02em" }}>
            Welcome back, <span style={{ color: C.gold }}>{user?.email?.split('@')[0] || 'Songwriter'}</span>
          </h1>
        </div>

        {successMsg && (
          <div style={{ background: "#1a2a1a", border: "1px solid #2a4a2a", borderRadius: 8, padding: "12px 16px", marginBottom: 20, color: "#6bff6b", fontSize: 14 }}>✓ {successMsg}</div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 40 }}>
          <StatCard label="Credits" value={credits} icon="✦" />
          <StatCard label="Email" value={user?.email || '—'} icon="◆" small />
        </div>

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 48 }}>
          <ActionCard title="Create Song" desc="Generate Suno-ready lyrics" icon="✦" onClick={() => router.push('/generator')} />
          <ActionCard title="View Archive" desc="Your saved songs" icon="📜" onClick={() => router.push('/archive')} />
        </div>

        {/* Buy credits */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 32 }}>
          <h2 style={{ fontFamily: font.display, fontSize: 22, fontWeight: 400, marginBottom: 6 }}>Buy Credits</h2>
          <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>Each credit generates one complete song with lyrics and style prompt.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {[
              { n: 50, price: "$9.99", per: "$0.20", id: process.env.NEXT_PUBLIC_STRIPE_PRICE_50 || '' },
              { n: 150, price: "$17.99", per: "$0.12", id: process.env.NEXT_PUBLIC_STRIPE_PRICE_150 || '', popular: true },
              { n: 300, price: "$29.99", per: "$0.10", id: process.env.NEXT_PUBLIC_STRIPE_PRICE_300 || '' },
            ].map(p => (
              <button key={p.n} onClick={() => buyCredits(p.id)} disabled={buying}
                style={{ background: C.inputBg, border: `1px solid ${p.popular ? C.gold : C.border}`, borderRadius: 8, padding: "24px 16px", cursor: buying ? "not-allowed" : "pointer", textAlign: "center", position: "relative", color: C.fg }}>
                {p.popular && <span style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: C.gold, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Popular</span>}
                <div style={{ fontFamily: font.display, fontSize: 20, fontWeight: 500 }}>{p.n} Credits</div>
                <div style={{ fontSize: 24, fontWeight: 700, margin: "8px 0" }}>{p.price}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{p.per}/song</div>
              </button>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 16 }}>Secure payment via Stripe · Card & PayPal</p>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, icon, small }: any) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "20px 24px" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: C.gold, fontSize: 18 }}>{icon}</span>
        <span style={{ fontFamily: small ? font.body : font.display, fontSize: small ? 14 : 32, fontWeight: 500, letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon, onClick }: any) {
  return (
    <button onClick={onClick}
      style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 24, cursor: "pointer", textAlign: "left", color: C.fg, transition: "border-color .2s" }}
      onMouseEnter={(e: any) => e.currentTarget.style.borderColor = C.gold}
      onMouseLeave={(e: any) => e.currentTarget.style.borderColor = C.border}>
      <div style={{ fontSize: 24, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: font.display, fontSize: 18, fontWeight: 500 }}>{title}</div>
      <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{desc}</div>
    </button>
  );
}
