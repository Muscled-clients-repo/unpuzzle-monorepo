CREATE TABLE IF NOT EXISTS public.transcripts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id text REFERENCES public.videos(id) ON DELETE CASCADE, -- foreign key to videos table
    text text NOT NULL,
    duration float NOT NULL, -- duration in seconds
    start_time float NOT NULL, -- start time in seconds
    lang text DEFAULT 'en', -- language of the transcript (default is English)
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read users" ON public.transcripts;
CREATE POLICY "Allow anon read users"
  ON public.transcripts
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Allow anon insert users" ON public.transcripts;
CREATE POLICY "Allow anon insert users"
  ON public.transcripts
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update users" ON public.transcripts;
CREATE POLICY "Allow anon update users"
  ON public.transcripts
  FOR UPDATE
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Allow anon delete users" ON public.transcripts;
CREATE POLICY "Allow anon delete users"
  ON public.transcripts
  FOR DELETE
  TO anon
  USING (true);