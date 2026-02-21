import api from './api';

export interface ActivityLog {
    _id: string;
    action: string;
    details: string;
    performedBy: { _id: string; name: string; email: string };
    relatedTask?: { _id: string; title: string };
    createdAt: string;
}

export const activityService = {
    async getRecent(limit = 5): Promise<ActivityLog[]> {
        const { data } = await api.get<{ success: boolean; data: ActivityLog[] }>(
            `/activities?limit=${limit}`
        );
        return data.data;
    },
};
