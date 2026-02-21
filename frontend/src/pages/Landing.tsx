import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const features = [
    { icon: '📋', title: 'Task Management', desc: 'Create, assign, and track clinical tasks with priority levels and due dates.' },
    { icon: '👥', title: 'Team Collaboration', desc: 'Assign tasks across your care team with role-based access control.' },
    { icon: '🔒', title: 'HIPAA-Minded', desc: 'Built with security best practices: encrypted auth, HttpOnly cookies, and input validation.' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Real-time charts showing task distribution, priorities, and team workload.' },
    { icon: '🔔', title: 'Activity Feed', desc: 'Stay up to date with real-time notifications on task changes and team activity.' },
    { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized React frontend with efficient API calls and responsive design.' },
];

const Landing = () => {
    const { user } = useAuth();
    const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'offline'>('checking');

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'}/api/health`
                );
                setHealthStatus(res.ok ? 'online' : 'offline');
            } catch {
                setHealthStatus('offline');
            }
        };
        checkHealth();
    }, []);

    return (
        <div className="landing">
            {/* Nav */}
            <nav className="landing-nav">
                <div className="landing-nav-inner">
                    <div className="landing-logo">
                        <span className="landing-logo-icon">⚕</span>
                        <span className="landing-logo-text">CareFlow</span>
                    </div>
                    <div className="landing-nav-links">
                        {user ? (
                            <Link to="/dashboard" className="landing-btn landing-btn--primary">
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="landing-btn landing-btn--ghost">
                                    Sign In
                                </Link>
                                <Link to="/register" className="landing-btn landing-btn--primary">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="landing-hero">
                <div className="landing-hero-content">
                    <span className="landing-pill">✨ Modern Healthcare Task Management</span>
                    <h1 className="landing-headline">
                        Streamline Your <span className="landing-gradient-text">Clinical Workflow</span>
                    </h1>
                    <p className="landing-subtitle">
                        CareFlow helps healthcare teams organize tasks, track priorities, and collaborate
                        efficiently — all in one secure, intuitive platform.
                    </p>
                    <div className="landing-cta-row">
                        <Link to="/register" className="landing-btn landing-btn--primary landing-btn--lg">
                            Start Free →
                        </Link>
                        <Link to="/login" className="landing-btn landing-btn--outline landing-btn--lg">
                            View Demo
                        </Link>
                    </div>
                    <div className="landing-social-proof">
                        <span>🏥</span>
                        <span className="landing-social-text">
                            Trusted by healthcare teams for secure task coordination
                        </span>
                    </div>
                </div>
                <div className="landing-hero-visual">
                    <div className="landing-mockup">
                        <div className="mockup-header">
                            <span className="mockup-dot" />
                            <span className="mockup-dot" />
                            <span className="mockup-dot" />
                        </div>
                        <div className="mockup-body">
                            <div className="mockup-stat">
                                <span className="mockup-stat-value">24</span>
                                <span className="mockup-stat-label">Active Tasks</span>
                            </div>
                            <div className="mockup-stat mockup-stat--success">
                                <span className="mockup-stat-value">89%</span>
                                <span className="mockup-stat-label">Completed</span>
                            </div>
                            <div className="mockup-bar" />
                            <div className="mockup-bar mockup-bar--short" />
                            <div className="mockup-bar mockup-bar--medium" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="landing-features" id="features">
                <h2 className="landing-section-title">Everything You Need</h2>
                <p className="landing-section-subtitle">
                    Built for modern healthcare teams that demand simplicity, security, and speed.
                </p>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div key={i} className="feature-card">
                            <span className="feature-icon">{f.icon}</span>
                            <h3 className="feature-title">{f.title}</h3>
                            <p className="feature-desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer with System Health */}
            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="footer-brand">
                        <span className="landing-logo-icon">⚕</span>
                        <span>CareFlow</span>
                        <span className="footer-copy">© {new Date().getFullYear()}</span>
                    </div>
                    <div className="footer-health">
                        <span
                            className={`health-dot health-dot--${healthStatus}`}
                        />
                        <span className="health-text">
                            System {healthStatus === 'checking' ? 'Checking...' : healthStatus === 'online' ? 'Operational' : 'Offline'}
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
