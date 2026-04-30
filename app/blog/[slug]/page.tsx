import Link from 'next/link';
import { getPost, getAllPosts } from '@/lib/posts';
import { PublicFooter } from '@/lib/components';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) return {};
  return { title: `${post.title} — AnointedLyrics Blog` };
}

const C = {
  bg: "#FAF9F7", card: "#FFFFFF", border: "#E5E3DD", borderLight: "#F0EDE8",
  fg: "#1C1B18", muted: "#908E85", gold: "#C6A24B", goldLight: "#F6EDCE",
};

const font = {
  display: "'Playfair Display','Georgia',serif",
  body: "'DM Sans','Helvetica Neue',sans-serif",
};

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: font.body, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: C.fg }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, background: C.fg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>♪</div>
            <div style={{ fontFamily: font.display, fontSize: 16 }}>AnointedLyrics<span style={{ color: C.gold }}>.</span></div>
          </Link>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Link href="/blog" style={{ fontSize: 13, color: C.muted, textDecoration: "none" }}>← Blog</Link>
            <Link href="/login" style={{ fontSize: 13, color: "#fff", background: C.fg, padding: "8px 16px", borderRadius: 6, textDecoration: "none", fontWeight: 500 }}>Get Started</Link>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 16px 80px" }}>
          {/* Category + date */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
            <span style={{ background: C.goldLight, color: C.gold, fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {post.category}
            </span>
            <span style={{ fontSize: 12, color: C.muted, fontFamily: "monospace" }}>
              {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: font.display, fontSize: "clamp(26px,5vw,42px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 32 }}>
            {post.title}
          </h1>

          {/* Content */}
          <div
            style={{ fontSize: 16, lineHeight: 1.8, color: C.fg }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div style={{ marginTop: 56, padding: "28px 24px", background: C.fg, borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontFamily: font.display, fontSize: 22, color: "#fff", marginBottom: 10 }}>
              Ready to generate your song?
            </div>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14, marginBottom: 20 }}>
              Get 3 free credits when you sign up. No card required.
            </p>
            <Link href="/login"
              style={{ display: "inline-block", padding: "12px 28px", background: C.gold, color: "#fff", borderRadius: 6, fontSize: 14, fontWeight: 700, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Start Free →
            </Link>
          </div>

          {/* Back to blog */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link href="/blog" style={{ fontSize: 13, color: C.muted, textDecoration: "none" }}>← Back to Blog</Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
