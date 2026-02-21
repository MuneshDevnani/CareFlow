import ActivityLog from '../models/ActivityLog';
import Task from '../models/Task';
import { IActivityLog, IUser, Role } from '../types';
import { Types } from 'mongoose';

export const activityService = {
    async log(
        action: string,
        details: string,
        userId: string | Types.ObjectId,
        taskId?: string | Types.ObjectId
    ): Promise<IActivityLog> {
        return ActivityLog.create({
            action,
            details,
            performedBy: userId,
            relatedTask: taskId || undefined,
        });
    },

    async getRecent(user: IUser, limit = 5): Promise<IActivityLog[]> {
        // Admin sees all, staff sees activities for their tasks
        let filter: Record<string, unknown> = {};

        if (user.role === Role.STAFF) {
            // Get task IDs the user owns
            const userTasks = await Task.find({
                $or: [{ assignedTo: user._id }, { createdBy: user._id }],
            }).select('_id');
            const taskIds = userTasks.map((t) => t._id);

            filter = {
                $or: [
                    { performedBy: user._id },
                    { relatedTask: { $in: taskIds } },
                ],
            };
        }

        return ActivityLog.find(filter)
            .populate('performedBy', 'name email')
            .populate('relatedTask', 'title')
            .sort({ createdAt: -1 })
            .limit(limit);
    },
};
