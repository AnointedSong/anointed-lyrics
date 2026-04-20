# AnointedLyrics v2

AI-powered song lyrics generator optimized for Suno AI.

## Stack
- Next.js 14 (App Router, Pages only — NO middleware/proxy)
- Supabase (Auth + Database — client-side only)
- Anthropic Claude API (Lyrics generation)
- Stripe (Payments)

## Quick Setup

### 1. Install
```bash
npm install
```

### 2. Supabase
1. Create project at supabase.com
2. Go to SQL Editor → paste contents of `supabase/schema.sql` → Run
3. Go to Authentication → Providers → enable Google
   - Get OAuth credentials from console.cloud.google.com
   - Redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
4. Go to Authentication → URL Configuration
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/dashboard`
5. Copy your keys from Settings → API

### 3. Stripe
1. Create 3 products (50/150/300 credits) in Stripe Dashboard
2. Copy the Price IDs

### 4. Environment
```bash
cp .env.example .env.local
# Fill in all values
```

### 5. Run
```bash
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

```bash
git init
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USER/anointedlyrics.git
git push -u origin main
```

1. Go to vercel.com/new → import repo
2. Add all env vars from .env.local (change NEXT_PUBLIC_SITE_URL to your Vercel URL)
3. Deploy
4. After deploy, set up Stripe webhook:
   - URL: `https://your-app.vercel.app/api/webhooks/stripe`
   - Event: `checkout.session.completed`
   - Copy signing secret → add as STRIPE_WEBHOOK_SECRET in Vercel
   - Redeploy
5. Update Supabase:
   - Site URL → your Vercel URL
   - Redirect URLs → add `https://your-app.vercel.app/dashboard`

## Architecture

NO middleware. NO proxy.ts. NO server-side auth.

Auth is 100% client-side via `@supabase/supabase-js`. The useAuth hook handles everything.
API routes verify users via Bearer token — the client sends `getSession().access_token` with each request.

This avoids the cookie/session mismatch issues that plague SSR auth setups.

## Pages
- `/` — Landing page
- `/login` — Sign in / Sign up
- `/dashboard` — Credits, stats, buy credits
- `/generator` — Create songs
- `/archive` — View saved songs

## API Routes
- `POST /api/generate` — Generate lyrics (Claude API)
- `GET /api/credits` — Check balance
- `GET/POST/DELETE /api/songs` — Song CRUD
- `POST /api/checkout` — Stripe checkout
- `POST /api/webhooks/stripe` — Stripe webhook
