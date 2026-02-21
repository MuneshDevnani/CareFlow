import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';
import './Layout.css';

const Layout = ({ children }: { children?: React.ReactNode }) => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="logo-icon">⚕</span>
                        <span className="logo-text">CareFlow</span>
                    </div>
                    <div className="sidebar-actions">
                        <NotificationBell />
                        <ThemeToggle />
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'nav-link--active' : ''}`
                        }
                    >
                        <span className="nav-icon">📊</span>
                        <span className="nav-label">Dashboard</span>
                    </NavLink>
                    <NavLink
                        to="/tasks/new"
                        className={({ isActive }) =>
                            `nav-link ${isActive ? 'nav-link--active' : ''}`
                        }
                    >
                        <span className="nav-icon">➕</span>
                        <span className="nav-label">New Task</span>
                    </NavLink>
                    {isAdmin && (
                        <NavLink
                            to="/admin/users"
                            className={({ isActive }) =>
                                `nav-link ${isActive ? 'nav-link--active' : ''}`
                            }
                        >
                            <span className="nav-icon">👥</span>
                            <span className="nav-label">Users</span>
                        </NavLink>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-role">{user?.role}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        ↩ Sign Out
                    </button>
                </div>
            </aside>

            <main className="main-content">
                {children || <Outlet />}
            </main>
        </div>
    );
};

export default Layout;
