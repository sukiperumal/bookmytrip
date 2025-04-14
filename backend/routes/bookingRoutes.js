const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
// Middleware can be imported here for authentication
// const { protect, admin } = require('../middleware/authMiddleware');

// Create a new vehicle booking
// In a real app, protect middleware would be used here
router.post('/', bookingController.createBooking);

// Calculate booking cost with options
router.post('/calculate', bookingController.calculateBookingCost);

// Get details of a specific booking
// In a real app, protect middleware would be used here
router.get('/:id', bookingController.getBookingById);

// Update a booking (date changes, etc.)
// In a real app, protect middleware would be used here
router.put('/:id', bookingController.updateBooking);

// Cancel a booking
// In a real app, protect middleware would be used here
router.delete('/:id', bookingController.cancelBooking);

// Update booking status (confirmed, in-progress, completed)
// In a real app, protect and admin middleware would be used here
router.put('/:id/status', bookingController.updateBookingStatus);

module.exports = router;