import { useState, useEffect, useRef } from 'react';
import { activityService, ActivityLog } from '../services/activity.service';
import { useAuth } from '../context/AuthContext';
import './NotificationBell.css';

const actionIcons: Record<string, string> = {
    task_created: '➕',
    task_updated: '✏️',
    task_deleted: '🗑️',
};

const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
};

const NotificationBell = () => {
    const { user } = useAuth();
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [open, setOpen] = useState(false);
    const [unread, setUnread] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;

        const fetch = async () => {
            try {
                const data = await activityService.getRecent(5);
                setActivities(data);
                // Count items newer than last seen
                const lastSeen = localStorage.getItem('lastSeenActivity');
                if (lastSeen) {
                    setUnread(data.filter((a) => new Date(a.createdAt) > new Date(lastSeen)).length);
                } else {
                    setUnread(data.length);
                }
            } catch {
                // silent
            }
        };

        fetch();
        const interval = setInterval(fetch, 30000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOpen = () => {
        setOpen(!open);
        if (!open) {
            setUnread(0);
            localStorage.setItem('lastSeenActivity', new Date().toISOString());
        }
    };

    return (
        <div className="notification-bell" ref={ref}>
            <button className="bell-btn" onClick={handleOpen} aria-label="Notifications">
                🔔
                {unread > 0 && <span className="bell-badge">{unread}</span>}
            </button>

            {open && (
                <div className="bell-dropdown">
                    <div className="bell-header">Recent Activity</div>
                    {activities.length === 0 ? (
                        <div className="bell-empty">No recent activity</div>
                    ) : (
                        activities.map((a) => (
                            <div key={a._id} className="bell-item">
                                <span className="bell-icon">{actionIcons[a.action] || '📌'}</span>
                                <div className="bell-content">
                                    <span className="bell-text">{a.details}</span>
                                    <span className="bell-time">
                                        {a.performedBy?.name} · {timeAgo(a.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
