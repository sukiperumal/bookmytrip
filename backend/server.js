const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import models to register schemas
// This prevents the "Schema hasn't been registered" errors
require('./models/User');
require('./models/Vehicle');
require('./models/Booking');
require('./models/Location');

// Import routes
const vehicleRoutes = require('./routes/vehicleRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const locationRoutes = require('./routes/locationRoutes');
const cabRoutes = require('./routes/cabRoutes');
const userRoutes = require('./routes/userRoutes');

// Import cab controller directly for test route
const cabController = require('./controllers/cabController');

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

// SUPER BASIC TEST ROUTE - at root level to test if any routes are working
app.get('/test', (req, res) => {
  console.log('Root test route hit');
  res.json({ message: 'Root test route is working!' });
});

// DIRECT TEST ROUTE - bypassing router
app.get('/api/partners-test', (req, res) => {
  console.log('Direct test route for partners hit');
  
  // Return mock data similar to what the controller would return
  res.json({
    data: [
      {
        partnerId: "partner123",
        name: "ABC Cabs",
        contact: {
          phone: "9876543210",
          email: "contact@abccabs.com"
        },
        vehicles: [
          { vehicleId: "veh456", type: "Sedan", registration: "KA01AB1234" }
        ],
        status: "active"
      }
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 1
    }
  });
});

// API Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/users', userRoutes);

// Mount partner routes directly to avoid router issues
app.get('/api/partners', cabController.getPartners);
app.post('/api/partners', cabController.createPartner);
app.get('/api/partners/:partnerId', cabController.getPartnerById);
app.put('/api/partners/:partnerId', cabController.updatePartner);
app.delete('/api/partners/:partnerId', cabController.deletePartner);

// Mount other cab routes
app.use('/api', cabRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Vehicle Rental Management API',
    version: '1.0.0',
    author: 'V Suki Perumal | PES1UG22AM180 | AIML - C Section',
    endpoints: {
      vehicles: '/api/vehicles',
      bookings: '/api/bookings',
      locations: '/api/locations',
      users: '/api/users',
      partners: '/api/partners',
      fares: '/api/fares',
      webhooks: '/api/webhooks'
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