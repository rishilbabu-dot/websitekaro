CREATE TABLE public.website_launch_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  business_name TEXT,
  business_type TEXT,
  google_maps_url TEXT,
  generated_website_id TEXT,
  generated_website_url TEXT,
  social_sources_used TEXT[] NOT NULL DEFAULT '{}',
  launch_status TEXT NOT NULL DEFAULT 'requested',
  email_status TEXT NOT NULL DEFAULT 'pending',
  email_error TEXT,
  source TEXT NOT NULL DEFAULT 'web',
  user_agent TEXT
);

CREATE INDEX website_launch_leads_created_at_idx ON public.website_launch_leads (created_at DESC);
CREATE UNIQUE INDEX website_launch_leads_dedupe_idx ON public.website_launch_leads (email, generated_website_id);

GRANT ALL ON public.website_launch_leads TO service_role;

ALTER TABLE public.website_launch_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages launch leads"
  ON public.website_launch_leads FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);