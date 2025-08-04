import { Request } from 'express';
import { Server } from 'socket.io';

/**
 * Extend Express Request type with custom properties
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * Clerk authentication data
       */
      auth?: {
        userId: string;
        sessionId: string;
        orgId?: string;
        claims?: Record<string, any>;
      };

      /**
       * User data from Clerk
       */
      user?: {
        id: string;
        email?: string;
        username?: string;
        first_name?: string;
        last_name?: string;
        image_url?: string;
        role?: string;
        bio?: string;
        title?: string;
        publicMetadata?: Record<string, any>;
        privateMetadata?: Record<string, any>;
        unsafeMetadata?: Record<string, any>;
        createdAt?: Date;
        updatedAt?: Date;
      };

      /**
       * Socket.io instance
       */
      io?: Server;

      /**
       * Socket ID for real-time communication
       */
      socketId?: string;

      /**
       * Request ID for tracking and logging
       */
      requestId?: string;

      /**
       * Client IP address
       */
      clientIp?: string;

      /**
       * Files uploaded via multer
       */
      file?: Express.Multer.File;
      files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    }
  }
}

/**
 * Module declarations for custom middleware
 */
declare module 'express-serve-static-core' {
  interface Request {
    /**
     * Custom properties added by middleware
     */
    startTime?: number;
    context?: Record<string, any>;
  }

  interface Response {
    /**
     * Custom response methods
     */
    sendSuccess?: (data: any, message?: string, statusCode?: number) => Response;
    sendError?: (error: Error | string, statusCode?: number) => Response;
    sendPaginated?: (data: any[], pagination: PaginationMeta) => Response;
  }
}

/**
 * Pagination metadata interface
 */
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Socket.io event types
 */
export interface SocketEvents {
  // Client to Server events
  'join-room': (roomId: string) => void;
  'leave-room': (roomId: string) => void;
  'agent-request': (data: { type: string; payload: any }) => void;
  'video-progress': (data: { videoId: string; progress: number }) => void;
  
  // Server to Client events
  'agent-response': (data: { type: string; payload: any }) => void;
  'agent-error': (error: { message: string; code?: string }) => void;
  'stream-data': (chunk: string) => void;
  'stream-end': () => void;
  'notification': (data: { type: string; message: string }) => void;
}

/**
 * API Response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  pagination?: PaginationMeta;
}

/**
 * Async handler type for controllers
 */
export type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export {};