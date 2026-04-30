export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  content: string;
};

export const posts: Post[] = [
  {
    slug: "how-to-use-anointedlyrics-with-suno",
    title: "How to Use AnointedLyrics with Suno AI — Step by Step",
    date: "2025-05-01",
    category: "Tutorial",
    excerpt: "A complete walkthrough on generating professional lyrics with AnointedLyrics and turning them into a full song on Suno AI.",
    content: `
<h2>Introduction</h2>
<p>AnointedLyrics is designed to work seamlessly with Suno AI. In this guide we walk you through the full process — from entering your song concept to having a finished track ready to share.</p>

<h2>Step 1 — Generate Your Lyrics</h2>
<p>Log in and go to the <strong>Generator</strong> page. Fill in your concept, genre, mood and language then click <strong>Generate Lyrics</strong>. Your complete song appears in 15–30 seconds with verses, chorus, bridge and production cues.</p>

<h2>Step 2 — Copy the Style Prompt</h2>
<p>Click <strong>Copy Style</strong> to copy the Suno-optimised style prompt that appears below your lyrics.</p>

<h2>Step 3 — Open Suno AI</h2>
<p>Go to Suno AI and select <strong>Custom Mode</strong>. Paste the Style Prompt into "Style of Music" and your lyrics into the "Lyrics" field. Click Create.</p>

<h2>Tips for Best Results</h2>
<ul>
  <li>Be specific in your concept — more detail means better lyrics</li>
  <li>Enable <strong>Auto-Cues</strong> for production direction</li>
  <li>Enable <strong>Metadata Header</strong> for extra Suno context</li>
  <li>Save lyrics to Archive to access them anytime</li>
</ul>
    `,
  },
  {
    slug: "best-genres-for-african-music-creators",
    title: "Best Genres for African Music Creators on Suno AI",
    date: "2025-05-03",
    category: "Tips",
    excerpt: "Afrobeats, Amapiano, Highlife, Gospel — which genres work best on Suno AI and how to get the most authentic sound.",
    content: `
<h2>African Music on Suno AI</h2>
<p>Suno AI has improved significantly in generating African music styles. AnointedLyrics is built specifically to give Suno the right style prompts and lyric structures for authentic results.</p>

<h2>Afrobeats</h2>
<p>One of the strongest genres on Suno AI. AnointedLyrics automatically includes log drums, talking drums, shekere, afro guitar and brass stabs in the style prompt.</p>
<p><strong>Best moods:</strong> Celebratory, Party/Hype, Romantic, Energetic</p>

<h2>Amapiano</h2>
<p>Works excellently with the right log drum and piano stabs specification. Choose Medium to Upbeat tempo for best results.</p>
<p><strong>Best moods:</strong> Party/Hype, Celebratory, Energetic</p>

<h2>Afrobeats Gospel</h2>
<p>One of the most unique genres on the platform — combining Afrobeats rhythm with powerful gospel lyrics. A niche very few AI tools handle well.</p>
<p><strong>Best moods:</strong> Spiritual, Triumphant, Empowering</p>

<h2>Gospel / Worship</h2>
<p>Use the Choir vocalist option and the Call & Response toggle for the most authentic gospel feel.</p>
    `,
  },
  {
    slug: "how-to-write-a-great-song-concept",
    title: "How to Write a Song Concept That Gets Amazing Lyrics",
    date: "2025-05-06",
    category: "Tips",
    excerpt: "The concept field is the most important part of your generation. Here is how to write one that gets incredible results every time.",
    content: `
<h2>Why the Concept Matters Most</h2>
<p>The song concept is the single most important field in AnointedLyrics. The more detail you give, the better your lyrics will be.</p>

<h2>What Makes a Bad Concept</h2>
<ul>
  <li>"A love song"</li>
  <li>"About God"</li>
  <li>"Feeling happy"</li>
</ul>
<p>Too vague — the AI has nothing specific to work with.</p>

<h2>What Makes a Great Concept</h2>
<ul>
  <li>"A young man from Lagos who moved to London chasing his dreams, struggling with loneliness but holding on to hope that one day he will make his family proud"</li>
  <li>"A gospel song about how God brought me through financial hardship and I am now celebrating his faithfulness"</li>
  <li>"An Amapiano party anthem about dancing all night at a rooftop in Johannesburg celebrating being alive"</li>
</ul>

<h2>The Formula</h2>
<p><strong>[Who] + [What they are going through] + [The emotion] + [The message]</strong></p>

<h2>Use the Notes Field</h2>
<p>Use Notes to request specific lines, name an artist whose style you want, or specify themes to avoid.</p>
    `,
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find(p => p.slug === slug);
}

export function getAllPosts(): Post[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
