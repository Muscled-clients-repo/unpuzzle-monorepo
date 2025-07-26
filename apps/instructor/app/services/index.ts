/**
 * Service Layer Index
 * Central service locator and export point
 */

// API Services
export { BaseApiService, type ApiResponse, type ApiError } from './api/base.service';
export { CourseService, type CreateCourseDto, type UpdateCourseDto, type CourseFilters, type PaginatedResponse } from './api/course.service';
export { VideoService, type CreateVideoDto, type UpdateVideoDto, type VideoFilters, type VideoUploadProgress } from './api/video.service';

// Storage Services
export { StorageService, type StorageItem } from './storage/storage.service';

// Utility Services
export { NotificationService, type NotificationType, type NotificationOptions } from './utils/notification.service';
export { ValidationService, type ValidationRule, type ValidationResult } from './utils/validation.service';

// Service instances
import { CourseService } from './api/course.service';
import { VideoService } from './api/video.service';
import { StorageService } from './storage/storage.service';
import { NotificationService } from './utils/notification.service';
import { ValidationService } from './utils/validation.service';

// Create service instances
const courseService = new CourseService();
const videoService = new VideoService();
const storageService = new StorageService();
const notificationService = new NotificationService();
const validationService = new ValidationService();

/**
 * Centralized service container
 * Access all services through this object
 */
export const services = {
  // API Services
  course: courseService,
  video: videoService,
  
  // Storage Services
  storage: storageService,
  
  // Utility Services
  notification: notificationService,
  validation: validationService,
} as const;

/**
 * Service initialization
 * Call this function to set up services with initial configuration
 */
export interface ServiceConfig {
  apiBaseUrl?: string;
  authToken?: string;
  storagePrefix?: string;
  notificationPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function initializeServices(config: ServiceConfig = {}) {
  // Set API base URL if provided
  if (config.apiBaseUrl) {
    process.env.NEXT_PUBLIC_API_URL = config.apiBaseUrl;
  }
  
  // Set auth token if provided
  if (config.authToken) {
    services.course.setAuthToken(config.authToken);
    services.video.setAuthToken(config.authToken);
  }
  
  // Configure storage prefix
  if (config.storagePrefix) {
    services.storage.setPrefix(config.storagePrefix);
  }
  
  // Configure notification position
  if (config.notificationPosition) {
    services.notification.setDefaultPosition(config.notificationPosition);
  }
}

/**
 * Service cleanup
 * Call this function to clean up services (e.g., on app unmount)
 */
export function cleanupServices() {
  services.course.removeAuthToken();
  services.video.removeAuthToken();
  services.storage.clear();
  services.notification.clearAll();
}

// Type exports for service container
export type Services = typeof services;
export type ServiceKey = keyof Services;