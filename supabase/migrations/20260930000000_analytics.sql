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

-- Page views: anyone can insert, anyone can read
CREATE POLICY "page_views_insert" ON public.page_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "page_views_select" ON public.page_views
  FOR SELECT USING (true);

-- Active sessions: full CRUD for all roles
CREATE POLICY "active_sessions_insert" ON public.active_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "active_sessions_update" ON public.active_sessions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "active_sessions_select" ON public.active_sessions
  FOR SELECT USING (true);

CREATE POLICY "active_sessions_delete" ON public.active_sessions
  FOR DELETE USING (true);
