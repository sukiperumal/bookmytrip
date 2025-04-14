const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
// Uncomment and use the middleware for authentication
const { protect, admin } = require('../middleware/authMiddleware');

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

// Add a review for a vehicle - adding protect middleware
router.post('/:id/reviews', protect, vehicleController.addVehicleReview);

// Get reviews for a vehicle
router.get('/:id/reviews', vehicleController.getVehicleReviews);

// Add a new vehicle to the fleet (Admin)
router.post('/', protect, admin, vehicleController.createVehicle);

// Update vehicle details (Admin)
router.put('/:id', protect, admin, vehicleController.updateVehicle);

// Remove a vehicle from the fleet (Admin)
router.delete('/:id', protect, admin, vehicleController.deleteVehicle);

module.exports = router;