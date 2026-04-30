import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { PublicFooter } from '@/lib/components';

export const metadata = { title: 'Blog — AnointedLyrics' };

const C = {
  bg: "#FAF9F7", card: "#FFFFFF", border: "#E5E3DD", borderLight: "#F0EDE8",
  fg: "#1C1B18", muted: "#908E85", gold: "#C6A24B", goldLight: "#F6EDCE",
};

const font = {
  display: "'Playfair Display','Georgia',serif",
  body: "'DM Sans','Helvetica Neue',sans-serif",
};

export default function BlogPage() {
  const posts = getAllPosts();

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
            <Link href="/login" style={{ fontSize: 13, color: C.muted, textDecoration: "none" }}>Sign In</Link>
            <Link href="/login" style={{ fontSize: 13, color: "#fff", background: C.fg, padding: "8px 16px", borderRadius: 6, textDecoration: "none", fontWeight: 500 }}>Get Started</Link>
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 16px 80px" }}>
          {/* Hero */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", color: C.muted, marginBottom: 12 }}>
              <span style={{ color: C.gold }}>●</span> &nbsp;Blog
            </div>
            <h1 style={{ fontFamily: font.display, fontSize: "clamp(32px,5vw,48px)", fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 12 }}>
              Tips, Tutorials & Updates
            </h1>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6 }}>
              Learn how to get the most out of AnointedLyrics and create better songs for Suno AI.
            </p>
          </div>

          {/* Posts list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, borderTop: `1px solid ${C.border}` }}>
            {posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: C.fg }}>
                <div style={{ padding: "28px 0", borderBottom: `1px solid ${C.borderLight}`, display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }}
                 <div style={{ padding: "28px 0", borderBottom: `1px solid ${C.borderLight}`, display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                      <span style={{ background: C.goldLight, color: C.gold, fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        {post.category}
                      </span>
                    </div>
                    <h2 style={{ fontFamily: font.display, fontSize: "clamp(18px,3vw,22px)", fontWeight: 400, marginBottom: 8, lineHeight: 1.3 }}>
                      {post.title}
                    </h2>
                    <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap", padding: "4px 8px", fontFamily: "monospace" }}>
                    {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

// ── BLOG CONTENT STYLES ──
// Add these to your app/globals.css:
//
// /* Blog content styles */
// .blog-content h2 { font-family: 'Playfair Display',serif; font-size: 1.4rem; font-weight: 500; color: #1C1B18; margin: 2rem 0 0.75rem; }
// .blog-content p { color: rgba(28,27,24,.78); line-height: 1.8; margin-bottom: 1rem; }
// .blog-content ul, .blog-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
// .blog-content li { color: rgba(28,27,24,.78); line-height: 1.8; margin-bottom: 0.25rem; }
// .blog-content strong { color: #1C1B18; font-weight: 600; }
// .blog-content a { color: #C6A24B; }
