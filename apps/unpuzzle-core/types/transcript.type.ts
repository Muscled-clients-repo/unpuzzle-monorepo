export interface Transcript {
  id?: string;
  video_id: string;
  start_time_sec: number;
  end_time_sec: number;
  content: string;
  created_at?: string;
  updated_at?: string;
}
