import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { statsService, StatsOverview } from '../services/stats.service';
import { useNavigate } from 'react-router-dom';
import { SkeletonCard } from './Skeleton';
import './DashboardOverview.css';

const DashboardOverview = () => {
    const [stats, setStats] = useState<StatsOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statsService.getOverview();
                setStats(data);
            } catch {
                // silent
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="overview-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const openCount = stats.byStatus.find((s) => s.name === 'Open')?.value || 0;
    const inProgressCount = stats.byStatus.find((s) => s.name === 'In Progress')?.value || 0;
    const doneCount = stats.byStatus.find((s) => s.name === 'Done')?.value || 0;

    return (
        <div className="fade-in">
            {/* Summary Cards */}
            <div className="stat-cards">
                <div className="stat-card">
                    <span className="stat-icon">📋</span>
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Tasks</span>
                    </div>
                </div>
                <div className="stat-card stat-card--open">
                    <span className="stat-icon">🔵</span>
                    <div className="stat-info">
                        <span className="stat-value">{openCount}</span>
                        <span className="stat-label">Open</span>
                    </div>
                </div>
                <div className="stat-card stat-card--progress">
                    <span className="stat-icon">🟡</span>
                    <div className="stat-info">
                        <span className="stat-value">{inProgressCount}</span>
                        <span className="stat-label">In Progress</span>
                    </div>
                </div>
                <div className="stat-card stat-card--done">
                    <span className="stat-icon">✅</span>
                    <div className="stat-info">
                        <span className="stat-value">{doneCount}</span>
                        <span className="stat-label">Done</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <button className="quick-action" onClick={() => navigate('/tasks/new')}>
                    <span className="quick-action-icon">➕</span>
                    <span>Create Task</span>
                </button>
                <button
                    className="quick-action quick-action--danger"
                    onClick={() => navigate('/dashboard?priority=high')}
                >
                    <span className="quick-action-icon">🔴</span>
                    <span>High Priority ({stats.byPriority.find((p) => p.name === 'High')?.value || 0})</span>
                </button>
                <button
                    className="quick-action quick-action--warning"
                    onClick={() => navigate('/dashboard?overdue=true')}
                >
                    <span className="quick-action-icon">⏰</span>
                    <span>Overdue ({stats.overdue})</span>
                </button>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-card card">
                    <h3 className="chart-title">Task Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.byStatus}
                                cx="50%"
                                cy="45%"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {stats.byStatus.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card card">
                    <h3 className="chart-title">Priority Breakdown</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={stats.byPriority} barSize={40}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {stats.byPriority.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
