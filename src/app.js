const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Serve static files (images, PDFs, etc.) from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/v1/menu', require('./routes/menuRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes'));

module.exports = app;