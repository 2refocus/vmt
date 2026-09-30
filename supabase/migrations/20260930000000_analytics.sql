-- Page views tracking
CREATE TABLE IF NOT EXISTS public.page_views (
  id          BIGSERIAL PRIMARY KEY,
  path        TEXT NOT NULL,
  referrer    TEXT,
  session_id  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_views_created ON public.page_views (created_at DESC);
CREATE INDEX idx_page_views_path    ON public.page_views (path);

-- Active sessions (heartbeat)
CREATE TABLE IF NOT EXISTS public.active_sessions (
  session_id  TEXT PRIMARY KEY,
  path        TEXT NOT NULL,
  last_seen   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_active_sessions_last_seen ON public.active_sessions (last_seen DESC);

-- RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- Anon can INSERT page views
CREATE POLICY "anon_insert_page_views" ON public.page_views
  FOR INSERT TO anon WITH CHECK (true);

-- Anon can INSERT/UPDATE active sessions
CREATE POLICY "anon_upsert_active_sessions" ON public.active_sessions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_active_sessions" ON public.active_sessions
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Authenticated can read everything
CREATE POLICY "auth_read_page_views" ON public.page_views
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_read_active_sessions" ON public.active_sessions
  FOR SELECT TO authenticated USING (true);

-- Anon can also read active_sessions count (for live indicator, optional)
CREATE POLICY "anon_select_active_sessions" ON public.active_sessions
  FOR SELECT TO anon USING (true);

-- Cleanup: auto-delete old sessions via a simple approach
-- (sessions older than 2 min are stale, cleaned on next dashboard load)
CREATE POLICY "auth_delete_active_sessions" ON public.active_sessions
  FOR DELETE TO authenticated USING (true);
