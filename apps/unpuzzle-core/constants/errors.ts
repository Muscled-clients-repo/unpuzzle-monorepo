/**
 * Centralized error messages for consistent error handling across the application
 */

export const ERROR_MESSAGES = {
  // General errors
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  BAD_REQUEST: 'Invalid request. Please check your input.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  
  // Authentication errors
  AUTH_FAILED: 'Authentication failed. Please log in again.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  
  // Validation errors
  VALIDATION_FAILED: 'Validation failed. Please check your input.',
  MISSING_REQUIRED_FIELDS: 'Required fields are missing.',
  INVALID_EMAIL: 'Please provide a valid email address.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a valid file.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  
  // Database errors
  DB_CONNECTION_ERROR: 'Unable to connect to the database. Please try again later.',
  DB_QUERY_ERROR: 'Database query failed. Please try again later.',
  RECORD_NOT_FOUND: 'Record not found.',
  DUPLICATE_ENTRY: 'This record already exists.',
  
  // Feature-specific errors
  VIDEO_NOT_FOUND: 'Video not found or has been removed.',
  COURSE_NOT_FOUND: 'Course not found or has been removed.',
  CHAPTER_NOT_FOUND: 'Chapter not found or has been removed.',
  TRANSCRIPT_GENERATION_FAILED: 'Unable to generate transcript. Please try again later.',
  PUZZLE_GENERATION_FAILED: 'Unable to generate puzzle. Please try again later.',
  
  // External service errors
  OPENAI_API_ERROR: 'AI service is currently unavailable. Please try again later.',
  STRIPE_PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  MUX_UPLOAD_FAILED: 'Video upload failed. Please try again.',
  YOUTUBE_API_ERROR: 'Unable to fetch YouTube data. Please try again later.',
  
  // File operation errors
  FILE_UPLOAD_FAILED: 'File upload failed. Please try again.',
  FILE_DELETE_FAILED: 'Unable to delete file. Please try again.',
  FILE_NOT_FOUND: 'File not found.',
  INVALID_FILE_PATH: 'Invalid file path provided.',
} as const;

export const ERROR_CODES = {
  // HTTP status codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = ERROR_CODES.INTERNAL_SERVER_ERROR,
    code?: string,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'APP_ERROR';
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Specific error classes for common scenarios
 */
export class ValidationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.VALIDATION_FAILED) {
    super(message, ERROR_CODES.BAD_REQUEST, 'VALIDATION_ERROR');
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.AUTH_FAILED) {
    super(message, ERROR_CODES.UNAUTHORIZED, 'AUTH_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(message, ERROR_CODES.NOT_FOUND, 'NOT_FOUND');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = ERROR_MESSAGES.DB_QUERY_ERROR) {
    super(message, ERROR_CODES.INTERNAL_SERVER_ERROR, 'DB_ERROR');
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    const defaultMessage = `External service ${service} is unavailable. Please try again later.`;
    super(message || defaultMessage, ERROR_CODES.SERVICE_UNAVAILABLE, 'EXTERNAL_SERVICE_ERROR');
  }
}