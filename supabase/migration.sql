-- BizSim — Supabase PostgreSQL Migration
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS simulations (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  modal_awal             NUMERIC        NOT NULL,
  biaya_tetap_bulanan    NUMERIC        NOT NULL,
  biaya_variabel_bulanan NUMERIC        NOT NULL,
  pendapatan_bulanan     NUMERIC        NOT NULL,
  predicted_months       INTEGER,
  business_class         TEXT,
  burn_rate              NUMERIC,
  created_at             TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

-- Allow full access to authenticated users for their own data
CREATE POLICY "Users can only access their own simulations"
  ON simulations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index user_id for faster lookups
CREATE INDEX IF NOT EXISTS simulations_user_id_idx ON simulations (user_id);

-- Index on created_at for fast ORDER BY queries
CREATE INDEX IF NOT EXISTS simulations_created_at_idx ON simulations (created_at DESC);
