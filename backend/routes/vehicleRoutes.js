const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
// Middleware can be imported here for authentication
// const { protect, admin } = require('../middleware/authMiddleware');

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
// In a real app, protect middleware would be used here
router.post('/:id/reviews', vehicleController.addVehicleReview);

// Get reviews for a vehicle
router.get('/:id/reviews', vehicleController.getVehicleReviews);

// Add a new vehicle to the fleet (Admin)
// In a real app, protect and admin middleware would be used here
router.post('/', vehicleController.createVehicle);

// Update vehicle details (Admin)
// In a real app, protect and admin middleware would be used here
router.put('/:id', vehicleController.updateVehicle);

// Remove a vehicle from the fleet (Admin)
// In a real app, protect and admin middleware would be used here
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;