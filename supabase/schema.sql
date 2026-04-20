-- ═══════════════════════════════════════════════════════
-- AnointedLyrics v2 — Supabase Schema
-- Run this in Supabase SQL Editor (in order)
-- ═══════════════════════════════════════════════════════

-- 1. Credit transactions ledger
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL DEFAULT 'generation',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_user ON credit_transactions(user_id);

-- 2. Songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  topic TEXT DEFAULT '',
  genre TEXT DEFAULT '',
  mood TEXT DEFAULT '',
  language TEXT DEFAULT '',
  structure TEXT DEFAULT '',
  style_tags TEXT DEFAULT '',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_songs_user ON songs(user_id);

-- 3. Balance RPC
CREATE OR REPLACE FUNCTION get_user_balance(uid UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(amount), 0)::INTEGER
  FROM credit_transactions
  WHERE user_id = uid;
$$;

-- 4. RLS
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own credits" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own songs" ON songs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users delete own songs" ON songs FOR DELETE USING (auth.uid() = user_id);

-- 5. Auto-grant 3 free credits on signup
CREATE OR REPLACE FUNCTION grant_starter_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO credit_transactions (user_id, amount, reason)
  VALUES (NEW.id, 3, 'bonus');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION grant_starter_credits();
