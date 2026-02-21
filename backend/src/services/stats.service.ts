import Task from '../models/Task';
import { IUser, Role } from '../types';
import { Types } from 'mongoose';

export const statsService = {
    async getOverview(user: IUser) {
        // Staff only see their own tasks
        const matchStage: Record<string, unknown> =
            user.role === Role.STAFF
                ? {
                    $or: [
                        { assignedTo: user._id },
                        { createdBy: user._id },
                    ],
                }
                : {};

        const [statusDist, priorityDist, overdueTasks, totalCount] =
            await Promise.all([
                Task.aggregate([
                    { $match: matchStage },
                    { $group: { _id: '$status', count: { $sum: 1 } } },
                ]),
                Task.aggregate([
                    { $match: matchStage },
                    { $group: { _id: '$priority', count: { $sum: 1 } } },
                ]),
                Task.countDocuments({
                    ...matchStage,
                    status: { $ne: 'done' },
                    dueDate: { $lt: new Date() },
                }),
                Task.countDocuments(matchStage),
            ]);

        // Normalize into fixed-shape objects
        const statusMap: Record<string, number> = { open: 0, in_progress: 0, done: 0 };
        for (const s of statusDist) {
            statusMap[s._id] = s.count;
        }

        const priorityMap: Record<string, number> = { low: 0, medium: 0, high: 0 };
        for (const p of priorityDist) {
            priorityMap[p._id] = p.count;
        }

        return {
            total: totalCount,
            overdue: overdueTasks,
            byStatus: [
                { name: 'Open', value: statusMap.open, color: '#3b82f6' },
                { name: 'In Progress', value: statusMap.in_progress, color: '#f59e0b' },
                { name: 'Done', value: statusMap.done, color: '#10b981' },
            ],
            byPriority: [
                { name: 'Low', value: priorityMap.low, color: '#10b981' },
                { name: 'Medium', value: priorityMap.medium, color: '#f59e0b' },
                { name: 'High', value: priorityMap.high, color: '#ef4444' },
            ],
        };
    },
};
