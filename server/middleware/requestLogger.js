// Simple request logger
const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  };
  
  module.exports = requestLogger;