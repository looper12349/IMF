const logger = {
    info: (...args) => console.log(new Date().toISOString(), ...args),
    error: (...args) => console.error(new Date().toISOString(), ...args),
    requestLogger: (req, res, next) => {
      logger.info(`${req.method} ${req.url}`);
      next();
    }
  };
  
  module.exports = logger;