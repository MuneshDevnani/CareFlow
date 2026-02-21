import User from '../models/User';
import { AppError } from '../utils/AppError';
import { IUser, Role } from '../types';

export const userService = {
    async getAllUsers(): Promise<Partial<IUser>[]> {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        return users;
    },

    async getUserById(userId: string): Promise<Partial<IUser>> {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    },

    async updateUserRole(userId: string, role: Role): Promise<Partial<IUser>> {
        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        user.role = role;
        await user.save();

        const { password, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    },

    async deleteUser(userId: string): Promise<void> {
        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        await User.findByIdAndDelete(userId);
    },
};
