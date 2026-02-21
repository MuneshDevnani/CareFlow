import { Response } from 'express';
import { statsService } from '../services/stats.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../types';

export const statsController = {
    getOverview: asyncHandler(async (req: AuthRequest, res: Response) => {
        const overview = await statsService.getOverview(req.user!);
        res.json({ success: true, data: overview });
    }),
};
