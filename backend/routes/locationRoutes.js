const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
// Adding authentication middleware
const { protect, admin } = require('../middleware/authMiddleware');

// List all pickup/dropoff locations
router.get('/', locationController.getLocations);

// Get details for a specific location
router.get('/:id', locationController.getLocationById);

// Check vehicle availability at a location
router.get('/:id/availability', locationController.getLocationAvailability);

// Create a new location (Admin)
router.post('/', protect, admin, locationController.createLocation);

// Update a location (Admin)
router.put('/:id', protect, admin, locationController.updateLocation);

// Delete a location (Admin)
router.delete('/:id', protect, admin, locationController.deleteLocation);

module.exports = router;