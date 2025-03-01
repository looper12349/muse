// const app = require('./app');
// const connectDB = require('./config/db');
// const { PORT, NODE_ENV } = require('./config/env');

// // Connect to database
// connectDB();

// // Start server
// const server = app.listen(PORT, () => {
//   console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   console.log('Unhandled Rejection:', err.message);
//   // Close server & exit process with failure
//   server.close(() => process.exit(1));
// });



// server.js
const app = require('./app');
const { PORT, NODE_ENV } = require('./config/env');

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`API accessible at http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('\x1b[31m%s\x1b[0m', 'UNHANDLED REJECTION 💥');
  console.error(err.name, err.message);
  // Close server & exit process with failure
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('\x1b[31m%s\x1b[0m', 'UNCAUGHT EXCEPTION 💥');
  console.error(err.name, err.message);
  process.exit(1);
});
