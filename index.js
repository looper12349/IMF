// require('dotenv').config();
// const express = require('express');
// const { sequelize, connectDatabase } = require('./src/db/database.js');
// const gadgetRoutes = require('./src/routes/gadget.js');
// const adminRoutes = require('./src/routes/admin.js');
// const authMiddleware = require('./src/middlewares/auth.js');
// const gadgetController = require('./src/controllers/gadgetController.js');
// const adminController = require('./src/controllers/adminController.js');
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());

// // Database connection
// connectDatabase()
//   .then(() => {
//     // Authentication routes would be added here

//     app.get('/', (req, res) => {
//       res.json({ message: 'Welcome to the Impossible Mission Force API' });
//     }
//     );

   

//     // Error handling middleware
//     app.use((err, req, res, next) => {
//       console.error(err.stack);
//       res.status(500).json({ 
//         message: 'Something went wrong!', 
//         error: process.env.NODE_ENV === 'production' ? {} : err.message 
//       });
//     });

//      // Admin routes
//      app.use('/admin', adminRoutes);

//      // Gadget routes
//      app.use('/gadgets', authMiddleware, gadgetRoutes);


//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch(err => {
//     console.error('Failed to connect to the database:', err);
//     process.exit(1);
//   });

// module.exports = app;


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