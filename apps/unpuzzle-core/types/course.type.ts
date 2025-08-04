export type Visibility = "public" | "private";

export interface Course {
  id: string;
  title: string;
  description: string;
  created_by: string;
  price: number;
  visibility: Visibility;
  created_at: string;
  updated_at: string | null;
}
