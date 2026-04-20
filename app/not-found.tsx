import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF9F7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 96, fontWeight: 400, color: '#C6A24B', lineHeight: 1, marginBottom: 16 }}>404</div>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 400, marginBottom: 12, color: '#1C1B18' }}>
        Page not found
      </h1>
      <p style={{ color: '#908E85', fontSize: 16, maxWidth: 360, lineHeight: 1.6, marginBottom: 32 }}>
        This page doesn&apos;t exist. Head back and keep writing.
      </p>
      <Link href="/"
        style={{ padding: '12px 24px', background: '#1C1B18', color: '#FAF9F7', borderRadius: 6, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.18em', textDecoration: 'none' }}>
        Back to Home
      </Link>
    </div>
  );
}
