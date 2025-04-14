const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
// Middleware can be imported here for authentication
// const { protect, admin } = require('../middleware/authMiddleware');

// List all pickup/dropoff locations
router.get('/', locationController.getLocations);

// Get details for a specific location
router.get('/:id', locationController.getLocationById);

// Check vehicle availability at a location
router.get('/:id/availability', locationController.getLocationAvailability);

// Create a new location (Admin)
// In a real app, protect and admin middleware would be used here
router.post('/', locationController.createLocation);

// Update a location (Admin)
// In a real app, protect and admin middleware would be used here
router.put('/:id', locationController.updateLocation);

// Delete a location (Admin)
// In a real app, protect and admin middleware would be used here
router.delete('/:id', locationController.deleteLocation);

module.exports = router;