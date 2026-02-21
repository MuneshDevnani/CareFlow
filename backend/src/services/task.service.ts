import Task from '../models/Task';
import { AppError } from '../utils/AppError';
import { ITask, IUser, PaginatedResult, PaginationQuery, Role } from '../types';
import { activityService } from './activity.service';

// Extract ID string from a field that may be populated or a raw ObjectId
const toId = (field: unknown): string => {
    if (!field) return '';
    if (typeof field === 'object' && field !== null && '_id' in field) {
        return (field as { _id: unknown })._id?.toString() ?? '';
    }
    return field.toString();
};

export const taskService = {
    async createTask(data: Partial<ITask>, userId: string): Promise<ITask> {
        const task = await Task.create({ ...data, createdBy: userId });
        const populated = await task.populate(['assignedTo', 'createdBy']);

        // Log activity
        await activityService.log(
            'task_created',
            `Created task "${task.title}"`,
            userId,
            task._id
        );

        return populated;
    },

    async getTasks(
        query: PaginationQuery,
        user: IUser
    ): Promise<PaginatedResult<ITask>> {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter: Record<string, any> = {};

        // Staff can only see tasks assigned to them or created by them
        if (user.role === Role.STAFF) {
            filter.$or = [
                { assignedTo: user._id },
                { createdBy: user._id },
            ];
        }

        if (query.status) filter.status = query.status;
        if (query.priority) filter.priority = query.priority;
        if (query.assignedTo) filter.assignedTo = query.assignedTo as any;
        if (query.search) {
            filter.title = { $regex: query.search, $options: 'i' } as any;
        }

        const [data, total] = await Promise.all([
            Task.find(filter)
                .populate('assignedTo', 'name email')
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Task.countDocuments(filter),
        ]);

        return {
            data,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    },

    async getTaskById(taskId: string, user: IUser): Promise<ITask> {
        const task = await Task.findById(taskId)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        if (!task) {
            throw new AppError('Task not found', 404);
        }

        // Staff can only see their own tasks
        if (
            user.role === Role.STAFF &&
            toId(task.assignedTo) !== user._id.toString() &&
            toId(task.createdBy) !== user._id.toString()
        ) {
            throw new AppError('Forbidden – you do not have access to this task', 403);
        }

        return task;
    },

    async updateTask(
        taskId: string,
        data: Partial<ITask>,
        user: IUser
    ): Promise<ITask> {
        const task = await Task.findById(taskId);

        if (!task) {
            throw new AppError('Task not found', 404);
        }

        // Staff can only update tasks assigned to them or created by them
        if (
            user.role === Role.STAFF &&
            toId(task.assignedTo) !== user._id.toString() &&
            toId(task.createdBy) !== user._id.toString()
        ) {
            throw new AppError('Forbidden – you do not have access to this task', 403);
        }

        const updatedTask = await Task.findByIdAndUpdate(taskId, data, {
            new: true,
            runValidators: true,
        })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        // Log activity
        await activityService.log(
            'task_updated',
            `Updated task "${task.title}"`,
            user._id.toString(),
            task._id
        );

        return updatedTask!;
    },

    async deleteTask(taskId: string, userId?: string): Promise<void> {
        const task = await Task.findById(taskId);

        if (!task) {
            throw new AppError('Task not found', 404);
        }

        await Task.findByIdAndDelete(taskId);

        // Log activity
        if (userId) {
            await activityService.log(
                'task_deleted',
                `Deleted task "${task.title}"`,
                userId,
                task._id
            );
        }
    },
};
