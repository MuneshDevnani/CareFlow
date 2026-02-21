import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import config from '../config';

interface ErrorResponse {
    success: false;
    message: string;
    stack?: string;
}

export const errorHandler = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Custom AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    }

    // Mongoose duplicate key
    if ('code' in err && (err as unknown as { code: number }).code === 11000) {
        statusCode = 409;
        message = 'Duplicate field value – resource already exists';
    }

    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid resource ID';
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    logger.error(`[${statusCode}] ${message}`, {
        error: err.message,
        stack: err.stack,
    });

    const response: ErrorResponse = {
        success: false,
        message,
    };

    if (config.nodeEnv === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};
