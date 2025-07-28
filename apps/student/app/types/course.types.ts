import { Asset } from './assets.types';
import { AiFile } from './videoeditor.types';

export interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  category?: string; // Assuming category is optional since it’s not in the given structure
  duration: string;
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
  instructor?: {
    name?: string;
    avatar?: string;
    bio?: string;
  };
  assets?: Asset[];
  aiFiles?: AiFile[];
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
  created_at?: string;
  updated_at?: string;
  thumbnail?: string;
  duration?: string;
  videos?: Video[];
  enrolled?: boolean;
  courseImage?: string;
  courseAuthor?: string;
  authorId?: string;
  category?: string;
}

export interface CoursesData {
  data: EnrolledCourse[];
}

export interface CourseCardProps {
  layout: "grid-1" | "grid-4" | "list";
  index: number;
  course: Course | EnrolledCourse;
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
