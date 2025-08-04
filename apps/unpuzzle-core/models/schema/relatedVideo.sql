CREATE TABLE IF NOT EXISTS public.related_videos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id text REFERENCES public.videos(id) ON DELETE CASCADE,
    related_video_id text REFERENCES public.videos(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);
ALTER TABLE public.related_videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon read" ON public.related_videos;
CREATE POLICY "Allow anon read"
  ON public.related_videos
  FOR SELECT
  TO anon
  USING (true);
DROP POLICY IF EXISTS "Allow anon insert" ON public.related_videos;
CREATE POLICY "Allow anon insert"
  ON public.related_videos
  FOR INSERT
  TO anon
  WITH CHECK (true);
DROP POLICY IF EXISTS "Allow anon update" ON public.related_videos;
CREATE POLICY "Allow anon update"
  ON public.related_videos
  FOR UPDATE
  TO anon
  USING (true);
DROP POLICY IF EXISTS "Allow anon delete" ON public.related_videos;
CREATE POLICY "Allow anon delete"
  ON public.related_videos
  FOR DELETE
  TO anon
  USING (true);

