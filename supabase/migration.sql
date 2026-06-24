-- ScreenVault AI — Database Migration
-- Run this in your Supabase SQL Editor

-- 1. Create category enum
CREATE TYPE capture_category AS ENUM (
  'financial',
  'tasks',
  'messages',
  'documents',
  'code',
  'links',
  'dates',
  'others'
);

-- 2. Create captures table
CREATE TABLE captures (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url      TEXT NOT NULL,
  image_path     TEXT NOT NULL,
  title          TEXT,
  summary        TEXT,
  extracted_text TEXT,
  category       capture_category DEFAULT 'others',
  tags           TEXT[] DEFAULT '{}',
  is_important   BOOLEAN DEFAULT FALSE,
  metadata       JSONB,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER captures_updated_at
  BEFORE UPDATE ON captures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. Indexes
CREATE INDEX idx_captures_category    ON captures(category);
CREATE INDEX idx_captures_created_at  ON captures(created_at DESC);
CREATE INDEX idx_captures_important   ON captures(is_important) WHERE is_important = TRUE;
CREATE INDEX idx_captures_tags        ON captures USING GIN(tags);

-- 5. Storage bucket (create in Supabase Dashboard > Storage)
-- Bucket name: captures  |  Public: true
-- Or via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('captures', 'captures', true);