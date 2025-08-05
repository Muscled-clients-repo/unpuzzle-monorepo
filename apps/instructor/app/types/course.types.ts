export interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  category?: string; // Assuming category is optional since it's not in the given structure
  duration: string;
  chapters_count?: number; // Count of chapters in this course
  videos_count?: number; // Count of videos in this course
  created_at?: string; // API might return created_at instead of createdAt
}

export interface EnrolledCoursesData {
  data: EnrolledCourse[];
}

// export interface Course {
//   id: string;
//   title: string;
//   description: string;
//   thumbnail: string;
//   price: number;
//   authorId: string;
//   createdAt: string;
//   updatedAt: string;
//   category?: string; // Assuming category is optional since it’s not in the given structure
//   duration: string;
// }
export interface Video {
  id: string;
  title: string;
  duration: number;
  video_url: string;
  yt_video_id: string;
  video_source: string;
  chapter_id: string;
  start_time?: number;
  end_time?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Chapter {
  id: string;
  title: string;
  order_index?: number;
  course_id: string;
  videos: Video[];
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  created_by?: string | null;
  price: number;
  visibility: "public" | "private";
  chapters: Chapter[];
  chapters_count?: number; // Count of chapters in this course
  videos_count?: number; // Count of videos in this course
  created_at?: string;
  updated_at?: string;
  thumbnail?: string;
  duration?: string;
}

export interface CoursesData {
  data: EnrolledCourse[];
}

export interface CoursesApiResponse {
  data: EnrolledCourse[];
  count: number;
  totalPages: number;
}

export interface CourseCardProps {
  layout: "grid-1" | "grid-4" | "list";
  index: number;
  course: Course;
}

export interface UserState {
  user: {
    publicMetadata?: {
      privileges?: string;
    };
  };
}

// export interface Video {
//     title: string;
//     duration: string;
//   }

export interface Module {
  title: string;
  videos: Video[];
}

export interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  isEdit: Boolean;
  courseId?: string;
}

export interface SelectCourseVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}
