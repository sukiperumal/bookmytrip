const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
// User controller would typically be imported here
// const userController = require('../controllers/userController');
// Middleware can be imported here for authentication
// const { protect, admin } = require('../middleware/authMiddleware');

// Get bookings for a specific user
// In a real app, protect middleware would be used here
router.get('/:id/bookings', bookingController.getUserBookings);

// Other user routes would be added here for a complete application:
// router.post('/login', userController.authUser);
// router.post('/register', userController.registerUser);
// router.get('/profile', protect, userController.getUserProfile);
// router.put('/profile', protect, userController.updateUserProfile);

module.exports = router;