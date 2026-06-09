-- BizSim — Supabase PostgreSQL Monthly Logs Migration
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS monthly_logs (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  bulan                  TEXT NOT NULL, -- e.g. "Bulan 1", "Januari"
  modal_awal             NUMERIC NOT NULL,
  biaya_tetap            NUMERIC NOT NULL,
  biaya_variabel         NUMERIC NOT NULL,
  pendapatan             NUMERIC NOT NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE monthly_logs ENABLE ROW LEVEL SECURITY;

-- Allow full access to authenticated users for their own monthly data logs
CREATE POLICY "Users can only access their own monthly logs"
  ON monthly_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index user_id for faster queries
CREATE INDEX IF NOT EXISTS monthly_logs_user_id_idx ON monthly_logs (user_id);

-- Index created_at for sorting chronological entries
CREATE INDEX IF NOT EXISTS monthly_logs_created_at_idx ON monthly_logs (created_at ASC);
