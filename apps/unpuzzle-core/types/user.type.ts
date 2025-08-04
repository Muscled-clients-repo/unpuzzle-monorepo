export type UserRole = "admin" | "user" | "moderator"; // extend roles as per your DB enum

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: UserRole;
  image_url?: string;
  bio?: string;
  title?: string;
  created_at?: string;
  updated_at?: string | null;
}
