import { Request, Response, NextFunction } from 'express';
import { AppError, ERROR_MESSAGES, ERROR_CODES } from '../../constants/errors';
import ResponseHandler from '../utility/ResponseHandler';

/**
 * Base controller class providing common functionality for all controllers
 */
export abstract class BaseController {
  protected responseHandler!: ResponseHandler;

  /**
   * Wraps async route handlers to catch errors
   */
  protected asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };

  /**
   * Standardized error handling
   */
  protected handleError(res: Response, error: any, customMessage?: string): Response {
    // Log error for debugging (in production, use proper logging service)
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error:', error);
    }

    // Handle known application errors
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }

    // Handle database errors
    if (error.code === '23505') { // Unique constraint violation
      return res.status(ERROR_CODES.CONFLICT).json({
        success: false,
        message: ERROR_MESSAGES.DUPLICATE_ENTRY
      });
    }

    if (error.code === 'ECONNREFUSED') { // Database connection error
      return res.status(ERROR_CODES.SERVICE_UNAVAILABLE).json({
        success: false,
        message: ERROR_MESSAGES.DB_CONNECTION_ERROR
      });
    }

    // Default error response
    const message = customMessage || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    return res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === 'development' && { 
        error: error.message,
        stack: error.stack 
      })
    });
  }

  /**
   * Standardized success response
   */
  protected sendSuccess(res: Response, data: any, message?: string, statusCode: number = 200): Response {

    return res.status(statusCode).json({
      success: true,
      message: message || 'Operation successful',
      body: data
    });
  }

  /**
   * Paginated response helper
   */
  protected sendPaginatedResponse(
    res: Response, 
    data: any[], 
    page: number, 
    limit: number, 
    total: number,
    message?: string
  ): Response {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return res.status(200).json({
      success: true,
      message: message || 'Data retrieved successfully',
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    });
  }

  /**
   * Check if user is authenticated (to be used with Clerk)
   */
  protected isAuthenticated(req: Request): boolean {
    return !!(req as any).auth?.userId;
  }

  /**
   * Get authenticated user ID
   */
  protected getUserId(req: Request): string | null {
    return (req as any).auth?.userId || null;
  }

  /**
   * Validate required fields
   */
  protected validateRequiredFields(data: any, requiredFields: string[]): string | null {
    for (const field of requiredFields) {
      if (!data[field]) {
        return `Missing required field: ${field}`;
      }
    }
    return null;
  }

  /**
   * Parse pagination parameters
   */
  protected getPaginationParams(req: Request): { page: number; limit: number; offset: number } {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  /**
   * Parse sort parameters
   */
  protected getSortParams(req: Request, allowedFields: string[], defaultField: string = 'created_at'): { 
    sortBy: string; 
    order: 'asc' | 'desc' 
  } {
    const sortBy = allowedFields.includes(req.query.sortBy as string) 
      ? req.query.sortBy as string 
      : defaultField;
    
    const order = req.query.order === 'asc' ? 'asc' : 'desc';

    return { sortBy, order };
  }

  /**
   * Sanitize user input
   */
  protected sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Check if file upload is valid
   */
  protected validateFileUpload(
    file: Express.Multer.File | undefined, 
    options: {
      required?: boolean;
      maxSize?: number; // in bytes
      allowedTypes?: string[];
    } = {}
  ): string | null {
    if (!file && options.required) {
      return 'File is required';
    }

    if (!file) return null;

    if (options.maxSize && file.size > options.maxSize) {
      return `File size exceeds maximum allowed size of ${options.maxSize / 1024 / 1024}MB`;
    }

    if (options.allowedTypes && !options.allowedTypes.includes(file.mimetype)) {
      return `File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`;
    }

    return null;
  }
}