import { Response } from 'express';
import { userService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';

export const userController = {
    getAllUsers: asyncHandler(async (_req: AuthRequest, res: Response) => {
        const users = await userService.getAllUsers();

        res.status(200).json({
            success: true,
            data: { users },
        });
    }),

    getUserById: asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const user = await userService.getUserById(id);

        res.status(200).json({
            success: true,
            data: { user },
        });
    }),

    updateUserRole: asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const user = await userService.updateUserRole(id, req.body.role);

        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: { user },
        });
    }),

    deleteUser: asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        await userService.deleteUser(id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    }),
};
