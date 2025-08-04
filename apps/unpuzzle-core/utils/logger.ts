/**
 * Production-ready logger utility
 * Replaces console.log statements with structured logging
 */

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;
  private serviceName: string;

  constructor(serviceName: string = 'unpuzzle-core') {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
    this.serviceName = serviceName;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      service: this.serviceName,
      message,
      ...context
    };

    if (this.isDevelopment) {
      // In development, use pretty printing
      return `[${timestamp}] [${level.toUpperCase()}] ${message}${context ? '\n' + JSON.stringify(context, null, 2) : ''}`;
    }

    // In production, use JSON format for log aggregation
    return JSON.stringify(logEntry);
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(level, message, context);

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(formattedMessage);
        }
        break;
    }
  }

  error(message: string, error?: Error | any, context?: LogContext): void {
    const errorContext = {
      ...context,
      ...(error && {
        error: {
          message: error.message || String(error),
          stack: error.stack,
          name: error.name,
          ...error
        }
      })
    };
    this.log(LogLevel.ERROR, message, errorContext);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log HTTP requests
   */
  logRequest(req: any, res: any, responseTime: number): void {
    const context = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      userId: req.auth?.userId || req.user?.id
    };

    const level = res.statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `${req.method} ${req.url} ${res.statusCode} ${responseTime}ms`;
    
    this.log(level, message, context);
  }

  /**
   * Create a child logger with additional context
   */
  child(context: LogContext): Logger {
    const childLogger = new Logger(this.serviceName);
    const originalLog = childLogger.log.bind(childLogger);
    
    childLogger.log = (level: LogLevel, message: string, ctx?: LogContext) => {
      originalLog(level, message, { ...context, ...ctx });
    };

    return childLogger;
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for creating service-specific loggers
export const createLogger = (serviceName: string) => new Logger(serviceName);

// Express middleware for request logging
export const requestLogger = (req: any, res: any, next: any) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    logger.logRequest(req, res, responseTime);
  });

  next();
};