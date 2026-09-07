-- Create submissions table for storing Deutschlandticket Job inquiries
-- This table is written to by the Edge Function only, not by the client directly

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Location info
  plz TEXT NOT NULL CHECK (plz ~ '^[0-9]{5}$'),
  
  -- Selected partners (array of partner slugs)
  partner_slugs TEXT[] NOT NULL CHECK (array_length(partner_slugs, 1) >= 1),
  
  -- Contact person
  salutation TEXT NOT NULL CHECK (salutation IN ('Frau', 'Herr', 'Divers')),
  first_name TEXT NOT NULL CHECK (length(first_name) >= 1),
  last_name TEXT NOT NULL CHECK (length(last_name) >= 1),
  
  -- Company info
  company TEXT NOT NULL CHECK (length(company) >= 1),
  position TEXT NOT NULL CHECK (length(position) >= 1),
  employees TEXT NOT NULL CHECK (employees IN ('1-9', '10-49', '50-249', '250+')),
  
  -- Contact details
  phone TEXT NOT NULL CHECK (length(phone) >= 3),
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  
  -- Address
  street TEXT NOT NULL CHECK (length(street) >= 3),
  city TEXT NOT NULL CHECK (length(city) >= 1),
  
  -- Preferences
  interest_phone BOOLEAN NOT NULL DEFAULT false,
  interest_contract BOOLEAN NOT NULL DEFAULT false,
  message TEXT,
  
  -- Mail delivery status tracking
  mail_status JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Create index for statistics queries
CREATE INDEX idx_submissions_created_at ON public.submissions (created_at);
CREATE INDEX idx_submissions_partner_slugs ON public.submissions USING gin (partner_slugs);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- No policies for anon role - all inserts happen through the Edge Function
-- with the service role key. The table is not readable or writable from the client.

-- Create a view for submission statistics (by partner and month)
CREATE OR REPLACE VIEW public.submission_stats AS
SELECT 
  date_trunc('month', created_at) AS month,
  unnest(partner_slugs) AS partner_slug,
  COUNT(*) AS submission_count
FROM public.submissions
GROUP BY date_trunc('month', created_at), unnest(partner_slugs)
ORDER BY month DESC, partner_slug;

-- Grant read access to the stats view for authenticated users (admin dashboard later)
-- For now, keep it restricted to service role only
REVOKE ALL ON public.submission_stats FROM anon, authenticated;
GRANT SELECT ON public.submission_stats TO service_role;

-- Grant minimal permissions on the table
REVOKE ALL ON public.submissions FROM anon, authenticated;
GRANT ALL ON public.submissions TO service_role;

COMMENT ON TABLE public.submissions IS 'Deutschlandticket Job inquiry submissions from the contact form';
COMMENT ON COLUMN public.submissions.partner_slugs IS 'Array of partner slugs the inquiry was sent to';
COMMENT ON COLUMN public.submissions.mail_status IS 'JSON object tracking email delivery status per recipient';
