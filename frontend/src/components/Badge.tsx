import './Badge.css';

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
    children: React.ReactNode;
}

const Badge = ({ variant = 'default', children }: BadgeProps) => {
    return (
        <span className={`badge badge-${variant}`}>
            {children}
        </span>
    );
};

export default Badge;

// Helper to get badge variant for task status/priority
export const getStatusVariant = (status: string): BadgeProps['variant'] => {
    switch (status) {
        case 'open': return 'info';
        case 'in_progress': return 'warning';
        case 'done': return 'success';
        default: return 'default';
    }
};

export const getPriorityVariant = (priority: string): BadgeProps['variant'] => {
    switch (priority) {
        case 'high': return 'danger';
        case 'medium': return 'warning';
        case 'low': return 'success';
        default: return 'default';
    }
};

export const formatStatus = (status: string): string => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};
