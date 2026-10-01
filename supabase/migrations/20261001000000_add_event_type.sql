-- Add event_type column to page_views for tracking downloads etc.
ALTER TABLE public.page_views
  ADD COLUMN IF NOT EXISTS event_type TEXT NOT NULL DEFAULT 'pageview';

CREATE INDEX IF NOT EXISTS idx_page_views_event_type ON public.page_views (event_type);
