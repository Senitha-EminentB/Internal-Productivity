const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');

// Route files
const authRoutes = require('./routes/authRoutes');

// Create express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Mount routers
app.use('/api/auth', authRoutes);

// Error handler middleware (should be last)
app.use(errorHandler);

module.exports = app;