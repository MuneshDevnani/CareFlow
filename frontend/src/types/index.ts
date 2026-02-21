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
export interface User {
    _id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: string;
}

// ─── Task ────────────────────────────────────────────────
export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    assignedTo?: User;
    createdBy: User;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

// ─── Auth ────────────────────────────────────────────────
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    data: {
        user: User;
        token: string;
    };
}

// ─── API ─────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: {
        data: T[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    };
}

// ─── Task Form ───────────────────────────────────────────
export interface TaskFormData {
    title: string;
    description: string;
    status: TaskStatus;
    priority: Priority;
    assignedTo: string;
    dueDate: string;
}
