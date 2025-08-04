export type PuzzleReflectType = string; // This should match the actual enum values from PostgreSQL

export interface PuzzleReflect {
  id?: string; // uuid with default gen_random_uuid()
  type?: PuzzleReflectType | null; // enum (nullable)
  loom_link?: string | null; // text (nullable)
  user_id?: string | null; // text foreign key (nullable)
  video_id?: string | null; // uuid foreign key (nullable)
  title?: string | null; // text (nullable)
  timestamp?: number | null; // number representing video time in seconds
  created_at?: string; // timestamp with default now()
  updated_at?: string | null; // timestamp with default now() (nullable)
}
