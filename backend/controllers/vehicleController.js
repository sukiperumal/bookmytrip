const Vehicle = require('../models/Vehicle');
const Location = require('../models/Location');

// @desc    Get all vehicles with filtering options
// @route   GET /api/vehicles
// @access  Public
exports.getVehicles = async (req, res) => {
  try {
    const { 
      type, 
      location, 
      minPrice, 
      maxPrice, 
      available, 
      minSeats, 
      search,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (type) filter.type = type;
    if (location) filter.location = location;
    if (available !== undefined) filter.available = available === 'true';
    if (minSeats) filter.seats = { $gte: parseInt(minSeats) };
    
    // Price filter
    if (minPrice || maxPrice) {
      filter.pricePerDay = {};
      if (minPrice) filter.pricePerDay.$gte = parseInt(minPrice);
      if (maxPrice) filter.pricePerDay.$lte = parseInt(maxPrice);
    }
    
    // Text search
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const vehicles = await Vehicle.find(filter)
      .populate('location', 'name address.city')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
      
    // Get total count for pagination
    const totalVehicles = await Vehicle.countDocuments(filter);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalVehicles / parseInt(limit));
    
    res.json({
      vehicles,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalVehicles,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a specific vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('location', 'name address coordinates contactInfo');
      
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.json(vehicle);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new vehicle
// @route   POST /api/vehicles
// @access  Private (Admin)
exports.createVehicle = async (req, res) => {
  try {
    const {
      name,
      type,
      images,
      pricePerDay,
      location,
      seats,
      fuelType,
      description,
      features
    } = req.body;
    
    // Verify that location exists
    const locationExists = await Location.findById(location);
    if (!locationExists) {
      return res.status(400).json({ message: 'Location does not exist' });
    }
    
    const vehicle = new Vehicle({
      name,
      type,
      images,
      pricePerDay,
      location,
      seats,
      fuelType,
      description,
      features
    });
    
    const savedVehicle = await vehicle.save();
    
    res.status(201).json(savedVehicle);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private (Admin)
exports.updateVehicle = async (req, res) => {
  try {
    const {
      name,
      type,
      images,
      pricePerDay,
      location,
      seats,
      fuelType,
      available,
      description,
      features
    } = req.body;
    
    // If location is being updated, verify it exists
    if (location) {
      const locationExists = await Location.findById(location);
      if (!locationExists) {
        return res.status(400).json({ message: 'Location does not exist' });
      }
    }
    
    // Find vehicle and update
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Update fields
    if (name) vehicle.name = name;
    if (type) vehicle.type = type;
    if (images) vehicle.images = images;
    if (pricePerDay) vehicle.pricePerDay = pricePerDay;
    if (location) vehicle.location = location;
    if (seats) vehicle.seats = seats;
    if (fuelType !== undefined) vehicle.fuelType = fuelType;
    if (available !== undefined) vehicle.available = available;
    if (description) vehicle.description = description;
    if (features) vehicle.features = features;
    
    vehicle.updatedAt = Date.now();
    
    const updatedVehicle = await vehicle.save();
    
    res.json(updatedVehicle);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin)
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    await vehicle.deleteOne();
    
    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all vehicle types
// @route   GET /api/vehicles/types
// @access  Public
exports.getVehicleTypes = async (req, res) => {
  try {
    const types = await Vehicle.distinct('type');
    res.json(types);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Search available vehicles by date range and location
// @route   GET /api/vehicles/availability
// @access  Public
exports.getAvailableVehicles = async (req, res) => {
  try {
    const { startDate, endDate, locationId } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    // Build filter
    const filter = {
      available: true,
      bookedDates: {
        $not: {
          $elemMatch: {
            startDate: { $lt: end },
            endDate: { $gt: start }
          }
        }
      }
    };
    
    // Add location filter if provided
    if (locationId) {
      filter.location = locationId;
    }
    
    const vehicles = await Vehicle.find(filter)
      .populate('location', 'name address.city');
      
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get pricing for a specific vehicle
// @route   GET /api/vehicles/:id/pricing
// @access  Public
exports.getVehiclePricing = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .select('pricePerDay');
      
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // You could add additional pricing logic here (weekend rates, seasonal pricing, etc.)
    const pricing = {
      base: {
        daily: vehicle.pricePerDay,
        weekly: vehicle.pricePerDay * 6.5, // 7 days with discount
        monthly: vehicle.pricePerDay * 25, // 30 days with discount
      },
      serviceFee: vehicle.pricePerDay * 0.1, // 10% service fee
      deposit: vehicle.pricePerDay * 2, // Example security deposit
      taxes: {
        rate: 0.08, // 8% tax rate
        amount: vehicle.pricePerDay * 0.08
      }
    };
    
    res.json(pricing);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add a review for a vehicle
// @route   POST /api/vehicles/:id/reviews
// @access  Private
exports.addVehicleReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and user ID is in req.user
    
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }
    
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if user has already reviewed this vehicle
    const alreadyReviewed = vehicle.reviews.find(
      review => review.user.toString() === userId.toString()
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Vehicle already reviewed' });
    }
    
    // Add review
    const review = {
      user: userId,
      rating: Number(rating),
      comment,
    };
    
    vehicle.reviews.push(review);
    vehicle.reviewCount = vehicle.reviews.length;
    
    // Update overall rating
    vehicle.rating = vehicle.reviews.reduce((acc, item) => item.rating + acc, 0) / vehicle.reviews.length;
    
    await vehicle.save();
    
    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get reviews for a vehicle
// @route   GET /api/vehicles/:id/reviews
// @access  Public
exports.getVehicleReviews = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .select('reviews rating reviewCount')
      .populate({
        path: 'reviews.user',
        select: 'name'
      });
      
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.json({
      reviews: vehicle.reviews,
      rating: vehicle.rating,
      reviewCount: vehicle.reviewCount
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};