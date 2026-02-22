import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Task, TaskStatus, Priority } from '../types';
import { taskService } from '../services/task.service';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/Badge';
import { getStatusVariant, getPriorityVariant, formatStatus } from '../components/badgeUtils';
import Button from '../components/Button';
import Layout from '../components/Layout';
import DashboardOverview from '../components/DashboardOverview';
import './Dashboard.css';

type TabType = 'overview' | 'tasks';

const Dashboard = () => {
    const { isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await taskService.getTasks({
                page,
                limit: 10,
                status: statusFilter || undefined,
                priority: priorityFilter || undefined,
                search: searchQuery || undefined,
            });
            setTasks(response.data.data);
            setTotalPages(response.data.pagination.pages);
        } catch {
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, priorityFilter, searchQuery]);

    useEffect(() => {
        if (activeTab === 'tasks') {
            fetchTasks();
        }
    }, [fetchTasks, activeTab]);

    const handleDelete = async (taskId: string) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await taskService.deleteTask(taskId);
            fetchTasks();
        } catch {
            setError('Failed to delete task');
        }
    };

    return (
        <Layout>
            <div className="fade-in">
                <div className="page-header">
                    <h1 className="page-title">Dashboard</h1>
                    <Link to="/tasks/new">
                        <Button>+ New Task</Button>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="dashboard-tabs">
                    <button
                        className={`dashboard-tab ${activeTab === 'overview' ? 'dashboard-tab--active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 Overview
                    </button>
                    <button
                        className={`dashboard-tab ${activeTab === 'tasks' ? 'dashboard-tab--active' : ''}`}
                        onClick={() => setActiveTab('tasks')}
                    >
                        📋 All Tasks
                    </button>
                </div>

                {activeTab === 'overview' ? (
                    <DashboardOverview />
                ) : (
                    <>
                        {/* Filters */}
                        <div className="filters-bar card">
                            <div className="filter-group">
                                <input
                                    type="text"
                                    className="input-field filter-search"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                />
                            </div>
                            <div className="filter-group">
                                <select
                                    className="input-field"
                                    value={statusFilter}
                                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                >
                                    <option value="">All Status</option>
                                    <option value={TaskStatus.OPEN}>Open</option>
                                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                                    <option value={TaskStatus.DONE}>Done</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <select
                                    className="input-field"
                                    value={priorityFilter}
                                    onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
                                >
                                    <option value="">All Priority</option>
                                    <option value={Priority.HIGH}>High</option>
                                    <option value={Priority.MEDIUM}>Medium</option>
                                    <option value={Priority.LOW}>Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Error */}
                        {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}

                        {/* Loading */}
                        {loading ? (
                            <div className="loading-screen" style={{ minHeight: '300px' }}>
                                <span className="spinner spinner-lg" />
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="empty-state card">
                                <span className="empty-icon">📋</span>
                                <h3>No tasks found</h3>
                                <p>Create your first task to get started</p>
                                <Link to="/tasks/new"><Button>Create Task</Button></Link>
                            </div>
                        ) : (
                            <>
                                <div className="tasks-grid">
                                    {tasks.map((task) => (
                                        <Link to={`/tasks/${task._id}`} key={task._id} className="task-card card">
                                            <div className="task-card-header">
                                                <div className="task-badges">
                                                    <Badge variant={getStatusVariant(task.status)}>
                                                        {formatStatus(task.status)}
                                                    </Badge>
                                                    <Badge variant={getPriorityVariant(task.priority)}>
                                                        {task.priority}
                                                    </Badge>
                                                </div>
                                                {isAdmin && (
                                                    <button
                                                        className="task-delete-btn"
                                                        onClick={(e) => { e.preventDefault(); handleDelete(task._id); }}
                                                        title="Delete task"
                                                    >
                                                        🗑
                                                    </button>
                                                )}
                                            </div>
                                            <h3 className="task-card-title">{task.title}</h3>
                                            {task.description && (
                                                <p className="task-card-desc">{task.description}</p>
                                            )}
                                            <div className="task-card-footer">
                                                <div className="task-meta">
                                                    {task.assignedTo && (
                                                        <span className="task-assignee">
                                                            <span className="mini-avatar">
                                                                {task.assignedTo.name.charAt(0)}
                                                            </span>
                                                            {task.assignedTo.name}
                                                        </span>
                                                    )}
                                                </div>
                                                {task.dueDate && (
                                                    <span className="task-due">
                                                        Due {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            disabled={page <= 1}
                                            onClick={() => setPage((p) => p - 1)}
                                        >
                                            ← Previous
                                        </Button>
                                        <span className="pagination-info">
                                            Page {page} of {totalPages}
                                        </span>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            disabled={page >= totalPages}
                                            onClick={() => setPage((p) => p + 1)}
                                        >
                                            Next →
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
