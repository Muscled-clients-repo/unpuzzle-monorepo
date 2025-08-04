CREATE TABLE IF NOT EXISTS public.videos (
    id text PRIMARY KEY,
    title text NOT NULL,
    description text,
    thumbnails jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read users" ON public.videos;
CREATE POLICY "Allow anon read users"
  ON public.videos
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Allow anon insert users" ON public.videos;
CREATE POLICY "Allow anon insert users"
  ON public.videos
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update users" ON public.videos;
CREATE POLICY "Allow anon update users"
  ON public.videos
  FOR UPDATE
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Allow anon delete users" ON public.videos;
CREATE POLICY "Allow anon delete users"
  ON public.videos
  FOR DELETE
  TO anon
  USING (true);