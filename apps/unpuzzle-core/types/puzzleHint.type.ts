export type PuzzleHintStatus = "still confused" | "got it";

export interface PuzzleHint {
  id?: string; // uuid with default gen_random_uuid()
  question: string;
  topic?: string; // text with default ''::text
  prompt?: string; // text with default ''::text
  completion?: any[]; // jsonb with default '[]'::jsonb
  duration?: number; // numeric with default '0'::numeric
  video_id?: string | null; // uuid foreign key (nullable)
  user_id: string; // text foreign key (unique constraint)
  status?: PuzzleHintStatus | null; // enum with values "still confused" or "got it"
  created_at?: string; // timestamp with default now()
  updated_at?: string | null; // timestamp with default now() (nullable)
}
