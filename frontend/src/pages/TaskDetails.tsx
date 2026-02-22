import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Task } from '../types';
import { taskService } from '../services/task.service';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/Badge';
import { getStatusVariant, getPriorityVariant, formatStatus } from '../components/badgeUtils';
import Button from '../components/Button';
import Layout from '../components/Layout';
import './TaskDetails.css';

const TaskDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            if (!id) return;
            try {
                const data = await taskService.getTaskById(id);
                setTask(data);
            } catch {
                setError('Failed to load task');
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleDelete = async () => {
        if (!id || !window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await taskService.deleteTask(id);
            navigate('/dashboard');
        } catch {
            setError('Failed to delete task');
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="loading-screen" style={{ minHeight: '400px' }}>
                    <span className="spinner spinner-lg" />
                </div>
            </Layout>
        );
    }

    if (error || !task) {
        return (
            <Layout>
                <div className="empty-state card">
                    <h3>{error || 'Task not found'}</h3>
                    <Link to="/dashboard"><Button variant="secondary">Back to Dashboard</Button></Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="fade-in">
                <div className="page-header">
                    <div>
                        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
                        <h1 className="page-title" style={{ marginTop: '0.5rem' }}>{task.title}</h1>
                    </div>
                    <div className="task-actions">
                        <Link to={`/tasks/${id}/edit`}>
                            <Button variant="secondary">Edit</Button>
                        </Link>
                        {isAdmin && (
                            <Button variant="danger" onClick={handleDelete}>Delete</Button>
                        )}
                    </div>
                </div>

                <div className="task-detail-grid">
                    <div className="task-detail-main card">
                        <div className="detail-section">
                            <h3 className="detail-label">Description</h3>
                            <p className="detail-value">
                                {task.description || 'No description provided'}
                            </p>
                        </div>
                    </div>

                    <div className="task-detail-sidebar">
                        <div className="card detail-info-card">
                            <div className="detail-row">
                                <span className="detail-label">Status</span>
                                <Badge variant={getStatusVariant(task.status)}>
                                    {formatStatus(task.status)}
                                </Badge>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Priority</span>
                                <Badge variant={getPriorityVariant(task.priority)}>
                                    {task.priority}
                                </Badge>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Assigned To</span>
                                <span className="detail-value">
                                    {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Created By</span>
                                <span className="detail-value">{task.createdBy.name}</span>
                            </div>
                            {task.dueDate && (
                                <div className="detail-row">
                                    <span className="detail-label">Due Date</span>
                                    <span className="detail-value">
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                            <div className="detail-row">
                                <span className="detail-label">Created</span>
                                <span className="detail-value">
                                    {new Date(task.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TaskDetails;
