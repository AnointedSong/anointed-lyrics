'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', background: '#FAF9F7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      <div style={{ fontSize: 48, marginBottom: 24 }}>♪</div>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 400, marginBottom: 12, color: '#1C1B18' }}>
        Something went wrong
      </h1>
      <p style={{ color: '#908E85', fontSize: 16, maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
        We hit an unexpected error. Your credits are safe — nothing was charged.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={reset}
          style={{ padding: '12px 24px', background: '#1C1B18', color: '#FAF9F7', border: 'none', borderRadius: 6, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer' }}>
          Try Again
        </button>
        <Link href="/dashboard"
          style={{ padding: '12px 24px', background: 'transparent', color: '#1C1B18', border: '1px solid #E5E3DD', borderRadius: 6, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.18em', textDecoration: 'none' }}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
