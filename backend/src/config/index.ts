import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: parseInt(process.env.PORT || '5001', 10),
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/careflow',
    jwtSecret: process.env.JWT_SECRET || 'careflow-dev-secret-change-me',
    jwtExpire: process.env.JWT_EXPIRE || '15m',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'careflow-refresh-secret-change-me',
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
} as const;

export default config;
