export interface InstructorAvailability {
  id?: string;
  instructor_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, etc.
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Meeting {
  id?: string;
  student_id: string;
  instructor_id: string;
  start_time: string;
  end_time?: string;
  actual_duration_minutes: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  meeting_link?: string;
  notes?: string;
  price_per_minute: number;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  stripe_payment_intent_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MeetingSession {
  id?: string;
  meeting_id: string;
  session_start: string;
  session_end?: string;
  duration_minutes: number;
  created_at?: string;
}

export interface CreateMeetingRequest {
  instructor_id: string;
  start_time: string;
  duration_minutes: number;
  notes?: string;
}

export interface UpdateMeetingStatusRequest {
  status: 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  actual_duration_minutes?: number;
  meeting_link?: string;
}

export interface InstructorProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  image_url?: string;
  is_instructor: boolean;
  hourly_rate: number;
  bio?: string;
  expertise?: string[];
  stripe_account_id?: string;
}

export interface MeetingWithParticipants extends Meeting {
  student?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    image_url?: string;
  };
  instructor?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    image_url?: string;
    hourly_rate: number;
    bio?: string;
    expertise?: string[];
  };
  sessions?: MeetingSession[];
} 