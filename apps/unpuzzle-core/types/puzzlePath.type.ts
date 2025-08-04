import { Video } from "./video.type";

export type PuzzlePathContent = 'yt_video';

export interface PuzzlePath {
  id: string; // uuid (required, no default)
  trigger_time: number; // integer (required)
  yt_video_id?: string | null; // text (nullable)
  content_url?: string | null; // text (nullable)
  content_type?: PuzzlePathContent; // enum with default 'yt_video'
  start_time?: number; // numeric with default '0'::numeric
  end_time?: number; // numeric with default '0'::numeric
  duration?: number; // numeric with default '0'::numeric
  title?: string; // text with default 'Default title'::text
  video_id: string; // uuid foreign key (required)
  content_video_id?: string | null; // uuid foreign key (nullable)
  user_id: string; // text foreign key (unique constraint)
  created_at?: string; // timestamp with default now()
  updated_at?: string; // timestamp with default now()
}
