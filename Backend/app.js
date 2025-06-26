const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');

// Route files
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

// Create express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: 'https://internal-productivity-frontend.onrender.com' // Allow requests from your frontend
}));
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Error handler middleware (should be last)
app.use(errorHandler);

module.exports = app;
