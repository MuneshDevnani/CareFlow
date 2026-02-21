import { Schema, model } from 'mongoose';
import { IActivityLog } from '../types';

const activityLogSchema = new Schema<IActivityLog>(
    {
        action: {
            type: String,
            required: true,
            trim: true,
        },
        details: {
            type: String,
            required: true,
            trim: true,
        },
        performedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        relatedTask: {
            type: Schema.Types.ObjectId,
            ref: 'Task',
        },
    },
    {
        timestamps: true,
    }
);

activityLogSchema.index({ performedBy: 1, createdAt: -1 });
activityLogSchema.index({ relatedTask: 1 });

export default model<IActivityLog>('ActivityLog', activityLogSchema);
