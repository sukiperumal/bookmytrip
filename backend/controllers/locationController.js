const Location = require('../models/Location');
const Vehicle = require('../models/Vehicle');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
exports.getLocations = async (req, res) => {
  try {
    const { country, city, active, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (country) filter['address.country'] = country;
    if (city) filter['address.city'] = city;
    if (active !== undefined) filter.active = active === 'true';
    
    // Text search
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const locations = await Location.find(filter)
      .sort({ 'address.country': 1, 'address.city': 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalLocations = await Location.countDocuments(filter);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalLocations / parseInt(limit));
    
    res.json({
      locations,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalLocations,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a specific location by ID
// @route   GET /api/locations/:id
// @access  Public
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    res.json(location);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid location ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new location
// @route   POST /api/locations
// @access  Private (Admin)
exports.createLocation = async (req, res) => {
  try {
    const {
      name,
      address,
      coordinates,
      contactInfo,
      hours,
      active
    } = req.body;
    
    // Create location
    const location = new Location({
      name,
      address,
      coordinates,
      contactInfo,
      hours,
      active
    });
    
    const savedLocation = await location.save();
    
    res.status(201).json(savedLocation);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a location
// @route   PUT /api/locations/:id
// @access  Private (Admin)
exports.updateLocation = async (req, res) => {
  try {
    const {
      name,
      address,
      coordinates,
      contactInfo,
      hours,
      active
    } = req.body;
    
    // Find location and update
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Update fields if provided
    if (name) location.name = name;
    if (address) location.address = { ...location.address, ...address };
    if (coordinates) location.coordinates = { ...location.coordinates, ...coordinates };
    if (contactInfo) location.contactInfo = { ...location.contactInfo, ...contactInfo };
    if (hours) location.hours = { ...location.hours, ...hours };
    if (active !== undefined) location.active = active;
    
    location.updatedAt = Date.now();
    
    const updatedLocation = await location.save();
    
    res.json(updatedLocation);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid location ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a location
// @route   DELETE /api/locations/:id
// @access  Private (Admin)
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Check if any vehicles are using this location
    const vehiclesUsingLocation = await Vehicle.countDocuments({ location: req.params.id });
    
    if (vehiclesUsingLocation > 0) {
      return res.status(400).json({ 
        message: `Cannot delete location as it is used by ${vehiclesUsingLocation} vehicle(s)` 
      });
    }
    
    await location.deleteOne();
    
    res.json({ message: 'Location removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid location ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Check vehicle availability at a location
// @route   GET /api/locations/:id/availability
// @access  Public
exports.getLocationAvailability = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Validate required query params
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Start date and end date are required' 
      });
    }
    
    // Verify location exists
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Validate dates
    if (start >= end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    // Find available vehicles at this location
    const availableVehicles = await Vehicle.find({
      location: req.params.id,
      available: true,
      bookedDates: {
        $not: {
          $elemMatch: {
            startDate: { $lt: end },
            endDate: { $gt: start }
          }
        }
      }
    }).select('name type pricePerDay images seats rating');
    
    res.json({
      location: {
        _id: location._id,
        name: location.name,
        address: location.address
      },
      dateRange: {
        startDate: start,
        endDate: end
      },
      availableVehicles,
      vehicleCount: availableVehicles.length
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid location ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};