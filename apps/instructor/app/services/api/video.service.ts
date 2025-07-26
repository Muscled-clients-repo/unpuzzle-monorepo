import { BaseApiService, type ApiResponse } from './base.service';
import type { Video } from '@/types/videos.types';

export interface CreateVideoDto {
  title: string;
  description?: string;
  url?: string;
  duration?: number;
  thumbnail?: string;
  courseId?: string;
  chapterId?: string;
  order?: number;
}

export interface UpdateVideoDto extends Partial<CreateVideoDto> {
  id: string;
}

export interface VideoFilters {
  courseId?: string;
  chapterId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'createdAt' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

export interface VideoUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Video API Service
 * Handles all video-related API operations
 */
export class VideoService extends BaseApiService {
  private readonly endpoint = '/videos';

  /**
   * Get all videos with optional filtering
   */
  async getVideos(filters?: VideoFilters): Promise<ApiResponse<Video[]>> {
    return this.withRetry(() => this.get<Video[]>(this.endpoint, filters));
  }

  /**
   * Get a single video by ID
   */
  async getVideo(id: string): Promise<ApiResponse<Video>> {
    return this.withRetry(() => this.get<Video>(`${this.endpoint}/${id}`));
  }

  /**
   * Create a new video
   */
  async createVideo(data: CreateVideoDto): Promise<ApiResponse<Video>> {
    return this.post<Video>(this.endpoint, data);
  }

  /**
   * Update an existing video
   */
  async updateVideo(data: UpdateVideoDto): Promise<ApiResponse<Video>> {
    const { id, ...updateData } = data;
    return this.put<Video>(`${this.endpoint}/${id}`, updateData);
  }

  /**
   * Delete a video
   */
  async deleteVideo(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Upload video file with progress tracking
   */
  async uploadVideo(
    file: File,
    onProgress?: (progress: VideoUploadProgress) => void
  ): Promise<ApiResponse<{ url: string; videoId: string }>> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('video', file);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress: VideoUploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            };
            onProgress(progress);
          }
        });
      }

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              data: response.data || response,
              message: response.message,
              success: true,
              status: xhr.status,
            });
          } catch (error) {
            reject({
              message: 'Invalid response format',
              status: xhr.status,
            });
          }
        } else {
          reject({
            message: xhr.statusText || 'Upload failed',
            status: xhr.status,
          });
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject({
          message: 'Network error during upload',
          status: 0,
        });
      });

      // Set headers
      Object.entries(this.headers).forEach(([key, value]) => {
        if (key !== 'Content-Type') { // Don't set Content-Type for FormData
          xhr.setRequestHeader(key, value);
        }
      });

      // Start upload
      xhr.open('POST', `${this.baseURL}${this.endpoint}/upload`);
      xhr.send(formData);
    });
  }

  /**
   * Upload video thumbnail
   */
  async uploadThumbnail(videoId: string, file: File): Promise<ApiResponse<{ url: string }>> {
    return this.upload<{ url: string }>(`${this.endpoint}/${videoId}/thumbnail`, file);
  }

  /**
   * Get video annotations
   */
  async getVideoAnnotations(videoId: string): Promise<ApiResponse<any[]>> {
    return this.withRetry(() => this.get<any[]>(`${this.endpoint}/${videoId}/annotations`));
  }

  /**
   * Add video annotation
   */
  async addAnnotation(videoId: string, annotationData: any): Promise<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${videoId}/annotations`, annotationData);
  }

  /**
   * Update video annotation
   */
  async updateAnnotation(videoId: string, annotationId: string, annotationData: any): Promise<ApiResponse<any>> {
    return this.put<any>(`${this.endpoint}/${videoId}/annotations/${annotationId}`, annotationData);
  }

  /**
   * Delete video annotation
   */
  async deleteAnnotation(videoId: string, annotationId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${videoId}/annotations/${annotationId}`);
  }

  /**
   * Get video quizzes
   */
  async getVideoQuizzes(videoId: string): Promise<ApiResponse<any[]>> {
    return this.withRetry(() => this.get<any[]>(`${this.endpoint}/${videoId}/quizzes`));
  }

  /**
   * Add video quiz
   */
  async addQuiz(videoId: string, quizData: any): Promise<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${videoId}/quizzes`, quizData);
  }

  /**
   * Update video quiz
   */
  async updateQuiz(videoId: string, quizId: string, quizData: any): Promise<ApiResponse<any>> {
    return this.put<any>(`${this.endpoint}/${videoId}/quizzes/${quizId}`, quizData);
  }

  /**
   * Delete video quiz
   */
  async deleteQuiz(videoId: string, quizId: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${videoId}/quizzes/${quizId}`);
  }

  /**
   * Get video analytics
   */
  async getVideoAnalytics(videoId: string, timeRange?: string): Promise<ApiResponse<any>> {
    const params = timeRange ? { timeRange } : undefined;
    return this.withRetry(() => this.get<any>(`${this.endpoint}/${videoId}/analytics`, params));
  }

  /**
   * Record video view
   */
  async recordView(videoId: string, timestamp?: number): Promise<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${videoId}/views`, { timestamp });
  }

  /**
   * Get video comments
   */
  async getVideoComments(videoId: string): Promise<ApiResponse<any[]>> {
    return this.withRetry(() => this.get<any[]>(`${this.endpoint}/${videoId}/comments`));
  }

  /**
   * Add video comment
   */
  async addComment(videoId: string, commentData: any): Promise<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${videoId}/comments`, commentData);
  }

  /**
   * Process video (for encoding, transcoding, etc.)
   */
  async processVideo(videoId: string, processingOptions?: any): Promise<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${videoId}/process`, processingOptions);
  }

  /**
   * Get video processing status
   */
  async getProcessingStatus(videoId: string): Promise<ApiResponse<any>> {
    return this.withRetry(() => this.get<any>(`${this.endpoint}/${videoId}/processing-status`));
  }

  /**
   * Generate video subtitles
   */
  async generateSubtitles(videoId: string, language?: string): Promise<ApiResponse<any>> {
    return this.post<any>(`${this.endpoint}/${videoId}/subtitles`, { language });
  }

  /**
   * Get video subtitles
   */
  async getSubtitles(videoId: string): Promise<ApiResponse<any[]>> {
    return this.withRetry(() => this.get<any[]>(`${this.endpoint}/${videoId}/subtitles`));
  }
}

// Service class is exported, instances created in services/index.ts