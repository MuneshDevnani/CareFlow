import './Skeleton.css';

interface SkeletonProps {
    variant?: 'line' | 'card' | 'circle';
    width?: string;
    height?: string;
    count?: number;
}

const Skeleton = ({ variant = 'line', width, height, count = 1 }: SkeletonProps) => {
    const items = Array.from({ length: count }, (_, i) => i);

    return (
        <>
            {items.map((i) => (
                <div
                    key={i}
                    className={`skeleton skeleton-${variant}`}
                    style={{ width, height }}
                />
            ))}
        </>
    );
};

export const SkeletonCard = () => (
    <div className="skeleton-card-wrapper">
        <Skeleton variant="line" height="1.25rem" width="60%" />
        <Skeleton variant="line" height="0.875rem" width="80%" />
        <Skeleton variant="line" height="0.875rem" width="40%" />
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <Skeleton variant="line" height="1.5rem" width="4rem" />
            <Skeleton variant="line" height="1.5rem" width="4rem" />
        </div>
    </div>
);

export default Skeleton;
