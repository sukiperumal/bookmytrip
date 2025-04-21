const express = require('express');
const router = express.Router();
const cabController = require('../controllers/cabController');

// == Fare calculation routes ==
// Calculate estimated cab fare
router.post('/fares/estimate', cabController.getCabFareEstimate);

// Get alternative fare options
router.post('/fares', cabController.getAlternativeFares);

// == Partner management routes ==
// List all cab partners with filtering options
router.get('/partners', cabController.getPartners);

// Create a new cab partner
router.post('/partners', cabController.createPartner);

// Get a specific cab partner
router.get('/partners/:partnerId', cabController.getPartnerById);

// Update a cab partner
router.put('/partners/:partnerId', cabController.updatePartner);

// Delete a cab partner
router.delete('/partners/:partnerId', cabController.deletePartner);

module.exports = router;
