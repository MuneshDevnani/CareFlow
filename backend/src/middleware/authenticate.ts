import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from '../config';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../types';

interface JwtPayload {
    id: string;
}

export const authenticate = async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        // Check Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Check cookies
        else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            throw new AppError('Not authorized – no token provided', 401);
        }

        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

        const user = await User.findById(decoded.id).select('+password');
        if (!user) {
            throw new AppError('User not found', 401);
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError('Not authorized – invalid token', 401));
        }
    }
};
