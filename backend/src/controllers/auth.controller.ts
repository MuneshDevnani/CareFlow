import { Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';
import config from '../config';

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth',
};

const setRefreshCookie = (res: Response, refreshToken: string) => {
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
};

export const authController = {
    register: asyncHandler(async (req: AuthRequest, res: Response) => {
        const { name, email, password } = req.body;
        const result = await authService.register(name, email, password);

        setRefreshCookie(res, result.refreshToken);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user: result.user, token: result.token },
        });
    }),

    login: asyncHandler(async (req: AuthRequest, res: Response) => {
        const { email, password } = req.body;
        const result = await authService.login(email, password);

        setRefreshCookie(res, result.refreshToken);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { user: result.user, token: result.token },
        });
    }),

    refresh: asyncHandler(async (req: AuthRequest, res: Response) => {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ success: false, message: 'No refresh token' });
            return;
        }

        const result = await authService.refreshTokens(refreshToken);

        // Rotate: set new refresh token cookie
        setRefreshCookie(res, result.refreshToken);

        res.json({
            success: true,
            data: { user: result.user, token: result.token },
        });
    }),

    logout: asyncHandler(async (_req: AuthRequest, res: Response) => {
        res.clearCookie('refreshToken', { path: '/api/auth' });
        res.json({ success: true, message: 'Logged out' });
    }),

    getMe: asyncHandler(async (req: AuthRequest, res: Response) => {
        const user = await authService.getMe(req.user!._id.toString());

        res.status(200).json({
            success: true,
            data: { user },
        });
    }),
};
