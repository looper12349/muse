// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const { NODE_ENV } = require('./config/env');
// const errorHandler = require('./middleware/errorMiddleware');
// const requestLogger = require('./middleware/requestLogger');

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const problemRoutes = require('./routes/problemRoutes');
// const threadRoutes = require('./routes/threadRoutes');
// const llmRoutes = require('./routes/llmRoutes');
// // Initialize express app
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// // Logging
// if (NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// } else {
//   app.use(requestLogger);
// }

// // Mount routes
// app.use('/api/auth', authRoutes);
// app.use('/api/problems', problemRoutes);
// app.use('/api/threads', threadRoutes);
// app.use('/api/llm', llmRoutes);

// // Basic route for API status
// app.get('/', (req, res) => {
//   res.json({ message: 'DSA Teaching Assistant API is running' });
// });

// // Error handler middleware
// app.use(errorHandler);

// // Handle 404 errors
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     data: null,
//     message: 'Route not found'
//   });
// });

// module.exports = app;



// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { NODE_ENV } = require('./config/env');
const errorHandler = require('./middleware/errorMiddleware');
const requestLogger = require('./middleware/requestLogger');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');
const threadRoutes = require('./routes/threadRoutes');
const llmRoutes = require('./routes/llmRoutes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(requestLogger);
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/llm', llmRoutes);

// Basic route for API status
app.get('/', (req, res) => {
  res.json({ 
    message: 'DSA Teaching Assistant API is running',
    version: '1.0.0',
    environment: NODE_ENV,
    defaultLLM: process.env.DEFAULT_LLM_PROVIDER || 'openai'
  });
});

// Error handler middleware
app.use(errorHandler);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: 'Route not found'
  });
});

module.exports = app;