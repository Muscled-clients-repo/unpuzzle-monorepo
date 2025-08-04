CREATE TABLE IF NOT EXISTS public.puzzles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.puzzles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon read users" ON public.puzzles;
CREATE POLICY "Allow anon read users"
ON public.puzzles
FOR SELECT
TO anon
USING (true);