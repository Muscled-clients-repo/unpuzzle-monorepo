import { Transcript } from "./transcript.type";
export interface Video {
  id?: string; // YouTube video ID as a string
  chapter_id: string; // ID of the chapter this video belongs to
  title: string;
  video_url: string;
  default_source: string;
  transcripts?: Transcript[]; // Add this optional property
  created_at?: string; // Timestamp for when the video was created
  updated_at?: string; // Timestamp for when the video was last updated
  yt_video_id?: string;
}
