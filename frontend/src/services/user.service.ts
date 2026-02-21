import api from './api';
import { User, ApiResponse, Role } from '../types';

export const userService = {
    async getAllUsers(): Promise<User[]> {
        const { data } = await api.get<ApiResponse<{ users: User[] }>>('/users');
        return data.data!.users;
    },

    async updateUserRole(userId: string, role: Role): Promise<User> {
        const { data } = await api.put<ApiResponse<{ user: User }>>(`/users/${userId}/role`, { role });
        return data.data!.user;
    },

    async deleteUser(userId: string): Promise<void> {
        await api.delete(`/users/${userId}`);
    },
};
