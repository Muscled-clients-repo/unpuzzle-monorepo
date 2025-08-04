export interface Check {
  id?: string; // uuid with default gen_random_uuid()
  created_at?: string; // timestamp with default now()
  updated_at?: string | null; // timestamp (nullable)
  question: string; // text (required)
  choices: any; // jsonb (required)
  answer: string; // text (required)
  puzzlecheck_id: string; // uuid foreign key (required)
}