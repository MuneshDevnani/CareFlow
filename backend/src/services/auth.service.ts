import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from '../config';
import { AppError } from '../utils/AppError';
import { IUser } from '../types';

const generateAccessToken = (userId: string): string => {
    return jwt.sign({ id: userId }, config.jwtSecret, {
        expiresIn: config.jwtExpire as string | number,
    } as jwt.SignOptions);
};

const generateRefreshToken = (userId: string): string => {
    return jwt.sign({ id: userId }, config.jwtRefreshSecret, {
        expiresIn: config.jwtRefreshExpire as string | number,
    } as jwt.SignOptions);
};

interface AuthResult {
    user: Partial<IUser>;
    token: string;
    refreshToken: string;
}

const sanitizeUser = (user: IUser): Partial<IUser> => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
});

export const authService = {
    async register(
        name: string,
        email: string,
        password: string
    ): Promise<AuthResult> {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('User with this email already exists', 409);
        }

        const user = await User.create({ name, email, password });
        const token = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        return { user: sanitizeUser(user), token, refreshToken };
    },

    async login(email: string, password: string): Promise<AuthResult> {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());

        return { user: sanitizeUser(user), token, refreshToken };
    },

    async refreshTokens(currentRefreshToken: string): Promise<AuthResult> {
        try {
            const decoded = jwt.verify(
                currentRefreshToken,
                config.jwtRefreshSecret
            ) as { id: string };

            const user = await User.findById(decoded.id);
            if (!user) {
                throw new AppError('User not found', 401);
            }

            const token = generateAccessToken(user._id.toString());
            const refreshToken = generateRefreshToken(user._id.toString());

            return { user: sanitizeUser(user), token, refreshToken };
        } catch (err) {
            throw new AppError('Invalid or expired refresh token', 401);
        }
    },

    async getMe(userId: string): Promise<Partial<IUser>> {
        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        return sanitizeUser(user);
    },
};
