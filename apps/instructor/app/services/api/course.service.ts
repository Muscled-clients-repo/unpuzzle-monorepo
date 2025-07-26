import { BaseApiService, type ApiResponse } from './base.service';
import type { Course } from '@/types/course.types';

export interface CreateCourseDto {
  title: string;
  description?: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  thumbnail?: string;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {
  id: string;
}

export interface CourseFilters {
  category?: string;
  level?: string;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Course API Service
 * Handles all course-related API operations
 */
export class CourseService extends BaseApiService {
  private readonly endpoint = '/courses';

  /**
   * Get all courses with optional filtering
   */
  async getCourses(filters?: CourseFilters): Promise<ApiResponse<PaginatedResponse<Course>>> {
    return this.withRetry(() => this.get<PaginatedResponse<Course>>(this.endpoint, filters));
  }

  /**
   * Get a single course by ID
   */
  async getCourse(id: string): Promise<ApiResponse<Course>> {
    return this.withRetry(() => this.get<Course>(`${this.endpoint}/${id}`));
  }

  /**
   * Create a new course
   */
  async createCourse(data: CreateCourseDto): Promise<ApiResponse<Course>> {
    return this.post<Course>(this.endpoint, data);
  }

  /**
   * Update an existing course
   */
  async updateCourse(data: UpdateCourseDto): Promise<ApiResponse<Course>> {
    const { id, ...updateData } = data;
    return this.put<Course>(`${this.endpoint}/${id}`, updateData);
  }

  /**
   * Delete a course
   */
  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Get course chapters
   */
  async getCourseChapters(courseId: string): Promise<ApiResponse<any[]>> {
    return this.withRetry(() => this.get<any[]>(`${this.endpoint}/${courseId}/chapters`));
  }

  /**
   * Add chapter to course
   */
  async addChapter(courseId: string, chapterData: any): Promise<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${courseId}/chapters`, chapterData);
  }

  /**
   * Update course chapter
   */
  async updateChapter(courseId: string, chapterId: string, chapterData: any): Promise<ApiResponse<any>> {
    return this.put<any>(`${this.endpoint}/${courseId}/chapters/${chapterId}`, chapterData);
  }

  /**
   * Delete course chapter
   */
  async deleteChapter(courseId: string, chapterId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${courseId}/chapters/${chapterId}`);
  }

  /**
   * Get course videos
   */
  async getCourseVideos(courseId: string): Promise<ApiResponse<any[]>> {
    return this.withRetry(() => this.get<any[]>(`${this.endpoint}/${courseId}/videos`));
  }

  /**
   * Add video to course
   */
  async addVideo(courseId: string, videoData: any): Promise<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${courseId}/videos`, videoData);
  }

  /**
   * Upload course thumbnail
   */
  async uploadThumbnail(courseId: string, file: File): Promise<ApiResponse<{ url: string }>> {
    return this.upload<{ url: string }>(`${this.endpoint}/${courseId}/thumbnail`, file);
  }

  /**
   * Get course analytics
   */
  async getCourseAnalytics(courseId: string, timeRange?: string): Promise<ApiResponse<any>> {
    const params = timeRange ? { timeRange } : undefined;
    return this.withRetry(() => this.get<any>(`${this.endpoint}/${courseId}/analytics`, params));
  }

  /**
   * Enroll user in course
   */
  async enrollInCourse(courseId: string): Promise<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${courseId}/enroll`);
  }

  /**
   * Get user's enrolled courses
   */
  async getEnrolledCourses(): Promise<ApiResponse<Course[]>> {
    return this.withRetry(() => this.get<Course[]>(`${this.endpoint}/enrolled`));
  }

  /**
   * Get course progress for user
   */
  async getCourseProgress(courseId: string): Promise<ApiResponse<any>> {
    return this.withRetry(() => this.get<any>(`${this.endpoint}/${courseId}/progress`));
  }

  /**
   * Update course progress
   */
  async updateProgress(courseId: string, videoId: string, progress: number): Promise<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${courseId}/progress`, {
      videoId,
      progress,
    });
  }

  /**
   * Mark video as completed
   */
  async markVideoCompleted(courseId: string, videoId: string): Promise<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${courseId}/videos/${videoId}/complete`);
  }

  /**
   * Get course reviews
   */
  async getCourseReviews(courseId: string): Promise<ApiResponse<any[]>> {
    return this.withRetry(() => this.get<any[]>(`${this.endpoint}/${courseId}/reviews`));
  }

  /**
   * Add course review
   */
  async addReview(courseId: string, reviewData: any): Promise<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${courseId}/reviews`, reviewData);
  }
}

// Service class is exported, instances created in services/index.ts