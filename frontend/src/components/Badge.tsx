import './Badge.css';

export interface BadgeProps {
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
