export interface PuzzleRequest {
  id: string;
  user_id: string;
  video_id: string;
  current_time_sec: number;
  transcript_content: string;
  ai_generated_him: string;
  created_at: string;
  updated_at: string | null;
}
