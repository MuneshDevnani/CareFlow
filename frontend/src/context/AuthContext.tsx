import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In-memory token – not in localStorage for security
let accessToken: string | null = null;

export const getToken = (): string | null => accessToken;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const refreshTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const scheduleRefresh = useCallback((expiresInMs: number) => {
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        // Refresh 1 minute before expiry (or at 80% of lifetime)
        const delay = Math.max(expiresInMs * 0.8, expiresInMs - 60000);
        refreshTimerRef.current = setTimeout(async () => {
            try {
                const res = await authService.refresh();
                accessToken = res.data.token;
                setUser(res.data.user);
                // 15min default → schedule next refresh
                scheduleRefresh(14 * 60 * 1000);
            } catch {
                accessToken = null;
                setUser(null);
            }
        }, delay);
    }, []);

    // On mount, try silent refresh using HttpOnly cookie
    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await authService.refresh();
                accessToken = res.data.token;
                setUser(res.data.user);
                scheduleRefresh(14 * 60 * 1000);
            } catch {
                accessToken = null;
                // Not logged in
            } finally {
                setLoading(false);
            }
        };
        initAuth();
        return () => {
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        };
    }, [scheduleRefresh]);

    const login = async (credentials: LoginCredentials) => {
        const response = await authService.login(credentials);
        accessToken = response.data.token;
        setUser(response.data.user);
        scheduleRefresh(14 * 60 * 1000);
    };

    const register = async (credentials: RegisterCredentials) => {
        const response = await authService.register(credentials);
        accessToken = response.data.token;
        setUser(response.data.user);
        scheduleRefresh(14 * 60 * 1000);
    };

    const logout = async () => {
        try { await authService.logout(); } catch { /* ignore */ }
        accessToken = null;
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        setUser(null);
    };

    const isAdmin = user?.role === 'admin';
    const getAccessToken = () => accessToken;

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, getAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
