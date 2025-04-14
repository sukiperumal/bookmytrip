const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const locationRoutes = require('./routes/locationRoutes');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// HTTP request logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/users', userRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Vehicle Rental Management API',
    version: '1.0.0',
    endpoints: {
      vehicles: '/api/vehicles',
      bookings: '/api/bookings',
      locations: '/api/locations',
      users: '/api/users',
    }
  });
});

// Webhooks for events
app.post('/api/webhooks/availability-change', (req, res) => {
  // In a real app, we'd process the webhook and notify relevant systems
  console.log('Availability change webhook received:', req.body);
  res.status(200).json({ success: true });
});

app.post('/api/webhooks/booking-status-change', (req, res) => {
  // In a real app, we'd process the webhook and notify relevant systems
  console.log('Booking status change webhook received:', req.body);
  res.status(200).json({ success: true });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB connected`);
});