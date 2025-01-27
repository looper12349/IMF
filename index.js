const express = require('express');
const { sequelize, connectDatabase } = require('./src/db/database.js');
const errorHandler = require('./src/middlewares/errorHandler');
const authMiddleware = require('./src/middlewares/auth');
const logger = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

class Server {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(logger.requestLogger);
    this.initializeRoutes();
    this.setupErrorHandling();
  }

  initializeRoutes() {
    // Welcome route
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Welcome to the Impossible Mission Force API',
        version: '1.0.0'
      });
    });

    // Import routes
    const adminRouter = require('./src/routes/admin.js');
    const gadgetRouter = require('./src/routes/gadget.js');

    // Use routes
    this.app.use('/api/v1/admin', adminRouter);
    this.app.use('/api/v1/gadgets', authMiddleware, gadgetRouter);

    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString()
      });
    });
  }

  setupErrorHandling() {
    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        message: 'Resource not found',
        path: req.path
      });
    });

    // Global error handler
    this.app.use(errorHandler);
  }

  async start() {
    try {
      await connectDatabase();
      logger.info('Database connection established');

      this.app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Create server instance
const server = new Server();
server.start();

// Export for testing
module.exports = {
  app: server.app,
  start: () => server.start()
};