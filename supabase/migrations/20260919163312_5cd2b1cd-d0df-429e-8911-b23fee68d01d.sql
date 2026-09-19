CREATE TABLE public.generated_websites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  city text NOT NULL DEFAULT 'Mumbai',
  industry text NOT NULL DEFAULT 'general',
  source_url text,
  official_website text,
  generation_mode text NOT NULL DEFAULT 'draft',
  verified boolean NOT NULL DEFAULT false,
  owner_email text,
  launch_status text NOT NULL DEFAULT 'preview',
  blueprint jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.generated_websites TO anon;
GRANT SELECT ON public.generated_websites TO authenticated;
GRANT ALL ON public.generated_websites TO service_role;

ALTER TABLE public.generated_websites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Generated websites are publicly viewable"
  ON public.generated_websites FOR SELECT
  USING (true);

CREATE POLICY "Service role manages generated websites"
  ON public.generated_websites FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX generated_websites_created_at_idx ON public.generated_websites (created_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generated_websites_set_updated_at
BEFORE UPDATE ON public.generated_websites
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();