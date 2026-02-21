import api from './api';

export interface StatsOverview {
    total: number;
    overdue: number;
    byStatus: { name: string; value: number; color: string }[];
    byPriority: { name: string; value: number; color: string }[];
}

export const statsService = {
    async getOverview(): Promise<StatsOverview> {
        const { data } = await api.get<{ success: boolean; data: StatsOverview }>(
            '/stats/overview'
        );
        return data.data;
    },
};
