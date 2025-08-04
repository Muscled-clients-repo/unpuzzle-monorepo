import { Check } from "./check.type";

export interface PuzzleCheck {
  id?: string; // uuid with default gen_random_uuid()
  topic: string; // text (required)
  created_at?: string; // timestamp with default now()
  updated_at?: string; // timestamp with default now()
  video_id: string; // uuid foreign key (required)
  duration?: number; // numeric with default '0'::numeric
  user_id: string; // text foreign key (required)
  total_checks?: number | null; // numeric (nullable)
  correct_checks_count?: number | null; // numeric (nullable)
  
  // Relationship fields (populated when needed)
  checks?: Check[]; // one-to-many relationship
  user?: any; // user data from Clerk (already working)
}
