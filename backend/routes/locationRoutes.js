const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

// List all pickup/dropoff locations
router.get('/', locationController.getLocations);

// Get details for a specific location
router.get('/:id', locationController.getLocationById);

// Check vehicle availability at a location
router.get('/:id/availability', locationController.getLocationAvailability);

module.exports = router;