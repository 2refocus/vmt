-- Site settings: key-value store for admin-configurable options
CREATE TABLE IF NOT EXISTS public.site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default VMT copy email
INSERT INTO public.site_settings (key, value, label) VALUES
  ('vmt_copy_email', 'service@vmt-thueringen.de', 'E-Mail für VMT-Kopie der Anfragen')
ON CONFLICT (key) DO NOTHING;

-- RLS: anon can read, authenticated can read+write
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_settings"  ON public.site_settings FOR SELECT TO anon        USING (true);
CREATE POLICY "auth_read_settings"  ON public.site_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_write_settings" ON public.site_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "auth_insert_settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);
