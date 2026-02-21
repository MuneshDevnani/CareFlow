import api from './api';
import { AuthResponse } from '../types';

export const authService = {
    async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    async register(credentials: { name: string; email: string; password: string }): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/register', credentials);
        return data;
    },

    async getMe() {
        const { data } = await api.get<{ success: boolean; data: { user: AuthResponse['data']['user'] } }>('/auth/me');
        return data.data.user;
    },

    async refresh(): Promise<AuthResponse> {
        const { data } = await api.post<AuthResponse>('/auth/refresh');
        return data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },
};
