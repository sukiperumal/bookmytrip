const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Create a new vehicle booking
router.post('/', protect, bookingController.createBooking);

// Get details of a specific booking
router.get('/:id', protect, bookingController.getBookingById);

// Update a booking (date changes, etc.)
router.put('/:id', protect, bookingController.updateBooking);

// Cancel a booking
router.delete('/:id', protect, bookingController.cancelBooking);

module.exports = router;