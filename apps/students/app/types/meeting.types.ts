export interface Instructor {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string;
  bio?: string;
  hourly_rate: number;
  expertise?: string[];
}

export interface Availability {
  day_of_week: number;
  is_available: boolean;
  start_time: string;
  end_time: string;
}

export interface Meeting {
  id: string;
  instructor: Instructor;
  start_time: string;
  actual_duration_minutes: number;
  total_amount: number;
  status: string;
}

export interface PaymentIntent {
  client_secret: string;
}

export interface Session {
  id: string;
  duration_minutes: number;
  total_amount: number;
} 