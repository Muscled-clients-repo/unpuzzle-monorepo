import { Request, Response, NextFunction } from 'express';

// Best practice error handler middleware for Express.js
function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode || 500;
    const isApiRequest = req.xhr || req.headers.accept?.includes('application/json');
    const isDev = process.env.NODE_ENV === 'development';

    // Log error stack in development
    if (isDev) {
        console.error(err.stack || err);
    }

    if (isApiRequest) {
        res.status(statusCode).json({
            success: false,
            message: err.message || 'Something went wrong!',
            ...(isDev && { stack: err.stack })
        });
    } else {
        res.status(statusCode).render('pages/error', {
            message: err.message || 'Something went wrong!',
            error: isDev ? err : {}
        });
    }
}

export default errorHandler;