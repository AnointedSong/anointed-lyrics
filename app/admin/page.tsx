'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { AppShell, C, font } from '@/lib/components';

// Add your own user ID here to restrict access to admin only
const ADMIN_EMAILS = ['hello@anointedrhythms.com']; // ← change to your email

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, getToken, signOut } = useAuth();
  const [credits, setCredits] = useState(0);
  const [users, setUsers] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [reason, setReason] = useState('gift');
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return; }
    if (!user) return;

    // Block non-admins
    if (!ADMIN_EMAILS.includes(user.email || '')) {
      router.push('/dashboard');
      return;
    }

    (async () => {
      const token = await getToken();
      const [credRes, userRes] = await Promise.all([
        fetch('/api/credits', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const credData = await credRes.json();
      const userData = await userRes.json();
      setCredits(credData.credits || 0);
      setUsers(userData.users || []);
      setDataLoading(false);
    })();
  }, [user, loading]);

  const addCredits = async () => {
    if (!selectedUser || !creditAmount) return;
    setAdding(true); setMsg(''); setError('');
    try {
      const token = await getToken();
      const res = await fetch('/api/admin/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: selectedUser.id, amount: parseInt(creditAmount), reason }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed'); setAdding(false); return; }
      setMsg(`✓ Added ${creditAmount} credits to ${selectedUser.email}`);
      setCreditAmount('');
      // Refresh users
      const token2 = await getToken();
      const userRes = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token2}` } });
      const userData = await userRes.json();
      setUsers(userData.users || []);
    } catch (e) { setError('Failed to add credits'); }
    setAdding(false);
  };

  const handleSignOut = async () => { await signOut(); router.push('/login'); };

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading || dataLoading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: C.muted }}>Loading…</p>
    </div>
  );

  return (
    <AppShell user={user} credits={credits} onSignOut={handleSignOut}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1rem 4rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: C.muted, marginBottom: 10 }}>
            <span style={{ color: C.gold }}>●</span> &nbsp;Admin Panel
          </div>
          <h1 style={{ fontFamily: font.display, fontSize: "clamp(24px,5vw,36px)", fontWeight: 400, letterSpacing: "-0.02em" }}>
            User Management
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 32 }}>
          <StatCard label="Total Users" value={users.length} />
          <StatCard label="Total Songs" value={users.reduce((a, u) => a + (u.song_count || 0), 0)} />
        </div>

        {/* Add Credits Panel */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.5rem", marginBottom: 32 }}>
          <h2 style={{ fontFamily: font.display, fontSize: 20, fontWeight: 400, marginBottom: 20 }}>Add Credits to User</h2>

          {msg && <div style={{ background: "#1a2a1a", border: "1px solid #2a4a2a", borderRadius: 6, padding: "10px 14px", marginBottom: 16, color: "#6bff6b", fontSize: 14 }}>{msg}</div>}
          {error && <div style={{ background: "#2a0000", border: "1px solid #4a0000", borderRadius: 6, padding: "10px 14px", marginBottom: 16, color: "#ff6b6b", fontSize: 14 }}>{error}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end", flexWrap: "wrap" }}>
            {/* User select */}
            <div>
              <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, display: "block", marginBottom: 6 }}>Select User</label>
              <select value={selectedUser?.id || ''} onChange={e => setSelectedUser(users.find(u => u.id === e.target.value) || null)}
                style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 14, background: C.inputBg, color: C.fg, outline: "none" }}>
                <option value="">Choose user…</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.email}</option>
                ))}
              </select>
            </div>

            {/* Credit amount */}
            <div>
              <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, display: "block", marginBottom: 6 }}>Credits</label>
              <input type="number" value={creditAmount} onChange={e => setCreditAmount(e.target.value)}
                placeholder="e.g. 50"
                style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 14, background: C.inputBg, color: C.fg, outline: "none" }} />
            </div>

            {/* Reason */}
            <div>
              <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, display: "block", marginBottom: 6 }}>Reason</label>
              <select value={reason} onChange={e => setReason(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 14, background: C.inputBg, color: C.fg, outline: "none" }}>
                <option value="gift">Gift</option>
                <option value="influencer">Influencer</option>
                <option value="promotion">Promotion</option>
                <option value="refund">Refund</option>
                <option value="bonus">Bonus</option>
                <option value="support">Support</option>
              </select>
            </div>

            {/* Button */}
            <button onClick={addCredits} disabled={adding || !selectedUser || !creditAmount}
              style={{ padding: "10px 20px", background: C.fg, color: C.bg, border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: adding ? "not-allowed" : "pointer", opacity: adding ? 0.6 : 1, whiteSpace: "nowrap", fontFamily: font.body }}>
              {adding ? "Adding…" : "Add Credits"}
            </button>
          </div>

          {/* Quick presets */}
          <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: C.muted, marginRight: 4 }}>Quick:</span>
            {[10, 50, 100, 250, 500].map(n => (
              <button key={n} onClick={() => setCreditAmount(String(n))}
                style={{ padding: "4px 12px", background: creditAmount === String(n) ? C.fg : C.inputBg, color: creditAmount === String(n) ? C.bg : C.fg, border: `1px solid ${C.border}`, borderRadius: 20, fontSize: 12, cursor: "pointer", fontFamily: font.body }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: font.display, fontSize: 18, fontWeight: 400, margin: 0 }}>All Users ({users.length})</h2>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email…"
              style={{ padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 13, background: C.inputBg, outline: "none", width: 220, color: C.fg }} />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F7F6F2" }}>
                  {["Email", "Credits", "Songs", "Joined", "Action"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: C.muted, fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: C.muted, fontSize: 14 }}>No users found</td></tr>
                ) : filtered.map((u, i) => (
                  <tr key={u.id} style={{ borderTop: `1px solid ${C.borderLight}`, background: i % 2 === 0 ? "transparent" : "#FAFAF8" }}>
                    <td style={{ padding: "12px 16px", fontSize: 14 }}>{u.email}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: C.goldLight, color: C.goldDark, padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, fontFamily: font.mono }}>
                        {u.balance} ✦
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 14, color: C.muted }}>{u.song_count || 0}</td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: C.muted, fontFamily: font.mono, whiteSpace: "nowrap" }}>
                      {new Date(u.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => { setSelectedUser(u); setCreditAmount(''); setMsg(''); }}
                        style={{ padding: "4px 12px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 12, cursor: "pointer", color: C.fg, fontFamily: font.body }}>
                        Add Credits
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "1.25rem" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.22em", color: C.muted, marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: font.display, fontSize: 32, fontWeight: 500 }}>{value}</div>
    </div>
  );
}
