export interface ActivityLog {
  id?: string; // UUID of the activity log (primary key)
  user_id: string; // UUID of the user performing the action (nullable)
  video_id: string; // UUID of the video being interacted with (nullable)
  fromTime?: number | null; // Start time (in seconds) for seek actions (nullable)
  toTime?: number | null; // End time (in seconds) for seek actions (nullable)
  duration?: number | null; // Duration of the action (in seconds) (nullable)
  actionType:
    | "pause"
    | "seek"
    | "play"
    | "puzzle_path"
    | "puzzle_hint"
    | "puzzle_check"
    | "puzzle_reflect";
  createdAt?: string; 
}
