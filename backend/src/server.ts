import app from './app';
import connectDB from './config/database';
import config from './config';
import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start server
        app.listen(config.port, () => {
            logger.info(
                `🚀 CareFlow server running on port ${config.port} in ${config.nodeEnv} mode`
            );
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
    logger.error('Unhandled Rejection:', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

startServer();
