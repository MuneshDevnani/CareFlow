import { useState, useEffect } from 'react';
import { User, Role } from '../types';
import { userService } from '../services/user.service';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Layout from '../components/Layout';
import './AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role>(Role.STAFF);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch {
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditRole = (user: User) => {
        setEditingUser(user);
        setSelectedRole(user.role);
    };

    const handleSaveRole = async () => {
        if (!editingUser) return;
        try {
            await userService.updateUserRole(editingUser._id, selectedRole);
            setEditingUser(null);
            fetchUsers();
        } catch {
            setError('Failed to update role');
        }
    };

    const handleDelete = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await userService.deleteUser(userId);
            fetchUsers();
        } catch {
            setError('Failed to delete user');
        }
    };

    return (
        <Layout>
            <div className="fade-in">
                <div className="page-header">
                    <h1 className="page-title">User Management</h1>
                </div>

                {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}

                {loading ? (
                    <div className="loading-screen" style={{ minHeight: '300px' }}>
                        <span className="spinner spinner-lg" />
                    </div>
                ) : (
                    <div className="card">
                        <div className="users-table-wrapper">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="user-cell">
                                                    <span className="mini-avatar">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                    {user.name}
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>
                                                <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button size="sm" variant="ghost" onClick={() => handleEditRole(user)}>
                                                        Edit Role
                                                    </Button>
                                                    <Button size="sm" variant="danger" onClick={() => handleDelete(user._id)}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Edit Role Modal */}
                <Modal
                    isOpen={!!editingUser}
                    onClose={() => setEditingUser(null)}
                    title="Update User Role"
                >
                    {editingUser && (
                        <div className="role-modal-content">
                            <p className="role-modal-user">
                                Changing role for <strong>{editingUser.name}</strong>
                            </p>
                            <div className="input-group">
                                <label htmlFor="role" className="input-label">Role</label>
                                <select
                                    id="role"
                                    className="input-field"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                                >
                                    <option value={Role.STAFF}>Staff</option>
                                    <option value={Role.ADMIN}>Admin</option>
                                </select>
                            </div>
                            <div className="form-actions" style={{ marginTop: '1rem' }}>
                                <Button onClick={handleSaveRole}>Save</Button>
                                <Button variant="secondary" onClick={() => setEditingUser(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </Layout>
    );
};

export default AdminUsers;
