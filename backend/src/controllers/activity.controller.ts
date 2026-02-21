import { Response } from 'express';
import { activityService } from '../services/activity.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';

export const activityController = {
    getRecent: asyncHandler(async (req: AuthRequest, res: Response) => {
        const limit = parseInt(req.query.limit as string) || 5;
        const activities = await activityService.getRecent(req.user!, limit);
        res.json({ success: true, data: activities });
    }),
};
