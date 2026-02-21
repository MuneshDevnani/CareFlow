import mongoose, { Schema } from 'mongoose';
import { ITask, TaskStatus, Priority } from '../types';

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        status: {
            type: String,
            enum: Object.values(TaskStatus),
            default: TaskStatus.OPEN,
        },
        priority: {
            type: String,
            enum: Object.values(Priority),
            default: Priority.MEDIUM,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        dueDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Index for query optimization
taskSchema.index({ status: 1, priority: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ createdBy: 1 });

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
