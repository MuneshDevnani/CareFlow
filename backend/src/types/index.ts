import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─── Enums ───────────────────────────────────────────────
export enum Role {
    ADMIN = 'admin',
    STAFF = 'staff',
}

export enum TaskStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    DONE = 'done',
}

export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

// ─── User ────────────────────────────────────────────────
export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Task ────────────────────────────────────────────────
export interface ITask extends Document {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    assignedTo?: Types.ObjectId;
    createdBy: Types.ObjectId;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Activity Log ────────────────────────────────────────
export interface IActivityLog extends Document {
    _id: Types.ObjectId;
    action: string;
    details: string;
    performedBy: Types.ObjectId;
    relatedTask?: Types.ObjectId;
    createdAt: Date;
}

// ─── Auth Request ────────────────────────────────────────
export interface AuthRequest extends Request {
    user?: IUser;
}

// ─── Pagination ──────────────────────────────────────────
export interface PaginationQuery {
    page?: number;
    limit?: number;
    status?: TaskStatus;
    priority?: Priority;
    assignedTo?: string;
    search?: string;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

// ─── API Response ────────────────────────────────────────
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
}

