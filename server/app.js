// // app.js
// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');
// const { NODE_ENV } = require('./config/env');
// const errorHandler = require('./middleware/errorMiddleware');
// const requestLogger = require('./middleware/requestLogger');
// const connectDB = require('./config/db');

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const problemRoutes = require('./routes/problemRoutes');
// const threadRoutes = require('./routes/threadRoutes');
// const llmRoutes = require('./routes/llmRoutes');

// // Initialize express app
// const app = express();

// // Connect to database
// connectDB();

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
//   res.json({ 
//     message: 'DSA Teaching Assistant API is running',
//     version: '1.0.0',
//     environment: NODE_ENV,
//     defaultLLM: process.env.DEFAULT_LLM_PROVIDER || 'openai'
//   });
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

// CORS Configuration - Allow all origins
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions)); // Apply CORS with options

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

// Add CORS headers to all responses as a fallback
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  next();
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