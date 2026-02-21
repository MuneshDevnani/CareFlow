import { Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { AuthRequest, Role } from '../types';

export const authorize = (...roles: Role[]) => {
    return (req: AuthRequest, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            return next(new AppError('Not authorized', 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('Forbidden – insufficient permissions', 403)
            );
        }

        next();
    };
};
