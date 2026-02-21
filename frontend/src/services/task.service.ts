import api from './api';
import { Task, TaskFormData, PaginatedResponse, ApiResponse } from '../types';

interface TaskFilters {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    search?: string;
}

// Strip empty strings so Mongoose doesn't get "" for ObjectId / Date fields
const clean = (data: object) => {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
        if (value !== '' && value !== undefined) {
            result[key] = value;
        }
    }
    return result;
};

export const taskService = {
    async getTasks(filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.append(key, String(value));
            }
        });
        const { data } = await api.get<PaginatedResponse<Task>>(`/tasks?${params.toString()}`);
        return data;
    },

    async getTaskById(id: string): Promise<Task> {
        const { data } = await api.get<ApiResponse<{ task: Task }>>(`/tasks/${id}`);
        return data.data!.task;
    },

    async createTask(taskData: TaskFormData): Promise<Task> {
        const { data } = await api.post<ApiResponse<{ task: Task }>>('/tasks', clean(taskData));
        return data.data!.task;
    },

    async updateTask(id: string, taskData: Partial<TaskFormData>): Promise<Task> {
        const { data } = await api.put<ApiResponse<{ task: Task }>>(`/tasks/${id}`, clean(taskData));
        return data.data!.task;
    },

    async deleteTask(id: string): Promise<void> {
        await api.delete(`/tasks/${id}`);
    },
};
