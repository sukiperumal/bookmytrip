const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');

// Get all vehicles with filtering options
router.get('/', vehicleController.getVehicles);

// Get all vehicle types
router.get('/types', vehicleController.getVehicleTypes);

// Search available vehicles by date range and location
router.get('/availability', vehicleController.getAvailableVehicles);

// Get details for a specific vehicle
router.get('/:id', vehicleController.getVehicleById);

// Get pricing for a specific vehicle
router.get('/:id/pricing', vehicleController.getVehiclePricing);

// Add a review for a vehicle
router.post('/:id/reviews', protect, vehicleController.addVehicleReview);

// Get reviews for a vehicle
router.get('/:id/reviews', vehicleController.getVehicleReviews);

module.exports = router;