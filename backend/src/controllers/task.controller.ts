import { Response } from 'express';
import { taskService } from '../services/task.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';

export const taskController = {
    createTask: asyncHandler(async (req: AuthRequest, res: Response) => {
        const task = await taskService.createTask(req.body, req.user!._id.toString());

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: { task },
        });
    }),

    getTasks: asyncHandler(async (req: AuthRequest, res: Response) => {
        const result = await taskService.getTasks(req.query as any, req.user!);

        res.status(200).json({
            success: true,
            data: result,
        });
    }),

    getTaskById: asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const task = await taskService.getTaskById(id, req.user!);

        res.status(200).json({
            success: true,
            data: { task },
        });
    }),

    updateTask: asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        const task = await taskService.updateTask(id, req.body, req.user!);

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: { task },
        });
    }),

    deleteTask: asyncHandler(async (req: AuthRequest, res: Response) => {
        const id = req.params.id as string;
        await taskService.deleteTask(id, req.user!._id.toString());

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
        });
    }),
};
