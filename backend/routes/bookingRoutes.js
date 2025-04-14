const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
// Enabling authentication middleware
const { protect, admin } = require('../middleware/authMiddleware');

// Create a new vehicle booking
router.post('/', protect, bookingController.createBooking);

// Calculate booking cost with options
router.post('/calculate', bookingController.calculateBookingCost);

// Get details of a specific booking
router.get('/:id', protect, bookingController.getBookingById);

// Update a booking (date changes, etc.)
router.put('/:id', protect, bookingController.updateBooking);

// Cancel a booking
router.delete('/:id', protect, bookingController.cancelBooking);

// Update booking status (confirmed, in-progress, completed)
router.put('/:id/status', protect, admin, bookingController.updateBookingStatus);

module.exports = router;