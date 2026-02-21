import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import config from './config';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// ─── Security ────────────────────────────────────────────
app.use(helmet());
app.use(
    cors({
        origin: config.corsOrigin,
        credentials: true,
    })
);

// ─── Body Parsing ────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Logging ─────────────────────────────────────────────
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ─── Health Check ────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'CareFlow API is running',
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
    });
});

// ─── API Routes ──────────────────────────────────────────
app.use('/api', routes);

// ─── 404 Handler ─────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// ─── Global Error Handler ────────────────────────────────
app.use(errorHandler);

export default app;
