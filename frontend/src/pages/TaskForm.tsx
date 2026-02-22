import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TaskFormData, TaskStatus, Priority, User } from '../types';
import { taskService } from '../services/task.service';
import { userService } from '../services/user.service';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Layout from '../components/Layout';
import './TaskForm.css';

const TaskForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState<TaskFormData>({
        title: '',
        description: '',
        status: TaskStatus.OPEN,
        priority: Priority.MEDIUM,
        assignedTo: '',
        dueDate: '',
    });
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(isEditing);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch users for assignment (if admin)
                if (isAdmin) {
                    const userList = await userService.getAllUsers();
                    setUsers(userList);
                }

                // Fetch task if editing
                if (id) {
                    const task = await taskService.getTaskById(id);
                    setFormData({
                        title: task.title,
                        description: task.description || '',
                        status: task.status,
                        priority: task.priority,
                        assignedTo: task.assignedTo?._id || '',
                        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                    });
                }
            } catch {
                setError('Failed to load data');
            } finally {
                setFetchLoading(false);
            }
        };
        fetchData();
    }, [id, isAdmin]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        setLoading(true);
        try {
            if (isEditing && id) {
                await taskService.updateTask(id, formData);
            } else {
                await taskService.createTask(formData);
            }
            navigate('/dashboard');
        } catch (err: unknown) {
            const message = err instanceof Error && 'response' in err
                ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
                : undefined;
            setError(message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <Layout>
                <div className="loading-screen" style={{ minHeight: '400px' }}>
                    <span className="spinner spinner-lg" />
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
                        <h1 className="page-title" style={{ marginTop: '0.5rem' }}>
                            {isEditing ? 'Edit Task' : 'Create Task'}
                        </h1>
                    </div>
                </div>

                <div className="form-card card">
                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="task-form">
                        <Input
                            id="title"
                            name="title"
                            label="Title"
                            placeholder="Enter task title"
                            value={formData.title}
                            onChange={handleChange}
                        />

                        <div className="input-group">
                            <label htmlFor="description" className="input-label">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                className="input-field"
                                placeholder="Enter task description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>

                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="status" className="input-label">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    className="input-field"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value={TaskStatus.OPEN}>Open</option>
                                    <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                                    <option value={TaskStatus.DONE}>Done</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label htmlFor="priority" className="input-label">Priority</label>
                                <select
                                    id="priority"
                                    name="priority"
                                    className="input-field"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option value={Priority.LOW}>Low</option>
                                    <option value={Priority.MEDIUM}>Medium</option>
                                    <option value={Priority.HIGH}>High</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            {isAdmin && users.length > 0 && (
                                <div className="input-group">
                                    <label htmlFor="assignedTo" className="input-label">Assign To</label>
                                    <select
                                        id="assignedTo"
                                        name="assignedTo"
                                        className="input-field"
                                        value={formData.assignedTo}
                                        onChange={handleChange}
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map((u) => (
                                            <option key={u._id} value={u._id}>
                                                {u.name} ({u.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <Input
                                id="dueDate"
                                name="dueDate"
                                label="Due Date"
                                type="date"
                                value={formData.dueDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-actions">
                            <Button type="submit" loading={loading}>
                                {isEditing ? 'Update Task' : 'Create Task'}
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default TaskForm;
