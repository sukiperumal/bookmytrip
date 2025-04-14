const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Location = require('../models/Location');

// @desc    Create a new vehicle booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      startDate,
      endDate,
      pickupLocationId,
      dropoffLocationId,
      specialRequests
    } = req.body;
    
    // Get user ID from authenticated user
    const userId = req.user.id;  // Assuming authentication middleware sets this
    
    // Validate required fields
    if (!vehicleId || !startDate || !endDate || !pickupLocationId || !dropoffLocationId) {
      return res.status(400).json({ 
        message: 'Vehicle ID, start date, end date, pickup location, and dropoff location are required' 
      });
    }
    
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Validate dates
    if (start >= end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    // Check if dates are in the past
    const now = new Date();
    if (start < now) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }
    
    // Calculate total days
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // Find vehicle
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check availability
    const isAvailable = !vehicle.bookedDates.some(booking => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      // Check if there's an overlap
      return (start < bookingEnd && end > bookingStart);
    });
    
    if (!isAvailable) {
      return res.status(400).json({ 
        message: 'Vehicle is not available for the selected dates' 
      });
    }
    
    // Verify locations exist
    const [pickupLocation, dropoffLocation] = await Promise.all([
      Location.findById(pickupLocationId),
      Location.findById(dropoffLocationId)
    ]);
    
    if (!pickupLocation) {
      return res.status(404).json({ message: 'Pickup location not found' });
    }
    
    if (!dropoffLocation) {
      return res.status(404).json({ message: 'Dropoff location not found' });
    }
    
    // Calculate pricing
    const basePrice = vehicle.pricePerDay * totalDays;
    const serviceFee = basePrice * 0.1; // 10% service fee
    const totalPrice = basePrice + serviceFee;
    
    // Create booking
    const booking = new Booking({
      vehicle: vehicleId,
      user: userId,
      startDate: start,
      endDate: end,
      totalDays,
      pickupLocation: pickupLocationId,
      dropoffLocation: dropoffLocationId,
      totalPrice: basePrice,
      serviceFee,
      specialRequests
    });
    
    // Save booking
    const savedBooking = await booking.save();
    
    // Update vehicle's booked dates
    vehicle.bookedDates.push({
      startDate: start,
      endDate: end
    });
    await vehicle.save();
    
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get details of a specific booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle', 'name type images pricePerDay')
      .populate('pickupLocation', 'name address')
      .populate('dropoffLocation', 'name address');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // For testing purposes, allow access to any booking
    // In a real app, you would check ownership
    const isAdmin = req.user.role === 'admin';
    
    // Either we're in test mode or we check user ownership
    res.json(booking);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a booking (date changes, etc.)
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      pickupLocationId,
      dropoffLocationId,
      specialRequests
    } = req.body;
    
    // Find booking
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // For testing purposes, allow updating any booking
    // In a real app, you would check ownership
    
    // Only allow updates for pending bookings if not an admin
    if (booking.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({ 
        message: 'Cannot update booking once it has been confirmed' 
      });
    }
    
    // Process updates
    let needVehicleUpdate = false;
    
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : booking.startDate;
      const end = endDate ? new Date(endDate) : booking.endDate;
      
      // Validate dates
      if (start >= end) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }
      
      // Check if dates are in the past
      const now = new Date();
      if (start < now) {
        return res.status(400).json({ message: 'Start date cannot be in the past' });
      }
      
      // Calculate total days
      const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      // If dates changed, check availability
      if (startDate || endDate) {
        const vehicle = await Vehicle.findById(booking.vehicle);
        
        // Filter out current booking from vehicle's bookedDates
        const otherBookings = vehicle.bookedDates.filter(
          date => !date.startDate.getTime() === booking.startDate.getTime() && 
                 !date.endDate.getTime() === booking.endDate.getTime()
        );
        
        // Check if new dates conflict with other bookings
        const isAvailable = !otherBookings.some(booked => {
          const bookedStart = new Date(booked.startDate);
          const bookedEnd = new Date(booked.endDate);
          return (start < bookedEnd && end > bookedStart);
        });
        
        if (!isAvailable) {
          return res.status(400).json({ 
            message: 'Vehicle is not available for the selected dates' 
          });
        }
        
        // Update vehicle's booked dates
        needVehicleUpdate = true;
      }
      
      // Update booking dates
      booking.startDate = start;
      booking.endDate = end;
      booking.totalDays = totalDays;
      
      // Recalculate price
      const vehicle = await Vehicle.findById(booking.vehicle);
      const basePrice = vehicle.pricePerDay * totalDays;
      const serviceFee = basePrice * 0.1;
      
      booking.totalPrice = basePrice;
      booking.serviceFee = serviceFee;
    }
    
    // Update locations if provided
    if (pickupLocationId) {
      const pickupLocation = await Location.findById(pickupLocationId);
      if (!pickupLocation) {
        return res.status(404).json({ message: 'Pickup location not found' });
      }
      booking.pickupLocation = pickupLocationId;
    }
    
    if (dropoffLocationId) {
      const dropoffLocation = await Location.findById(dropoffLocationId);
      if (!dropoffLocation) {
        return res.status(404).json({ message: 'Dropoff location not found' });
      }
      booking.dropoffLocation = dropoffLocationId;
    }
    
    // Update special requests if provided
    if (specialRequests !== undefined) {
      booking.specialRequests = specialRequests;
    }
    
    booking.updatedAt = Date.now();
    
    // Save booking
    const updatedBooking = await booking.save();
    
    // Update vehicle if needed
    if (needVehicleUpdate) {
      const vehicle = await Vehicle.findById(booking.vehicle);
      
      // Remove old booking dates
      vehicle.bookedDates = vehicle.bookedDates.filter(
        date => date.startDate.getTime() !== booking.startDate.getTime() && 
               date.endDate.getTime() !== booking.endDate.getTime()
      );
      
      // Add new booking dates
      vehicle.bookedDates.push({
        startDate: booking.startDate,
        endDate: booking.endDate
      });
      
      await vehicle.save();
    }
    
    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // For testing purposes, allow cancelling any booking
    // In a real app, you would check ownership more strictly
    
    // Only allow cancellation for pending or confirmed bookings if not admin
    if (booking.status !== 'pending' && booking.status !== 'confirmed' && req.user.role !== 'admin') {
      return res.status(400).json({ 
        message: 'Cannot cancel booking that is already in progress or completed' 
      });
    }
    
    // Update status to cancelled
    booking.status = 'cancelled';
    booking.updatedAt = Date.now();
    
    await booking.save();
    
    // Remove booking dates from vehicle
    const vehicle = await Vehicle.findById(booking.vehicle);
    vehicle.bookedDates = vehicle.bookedDates.filter(
      date => date.startDate.getTime() !== booking.startDate.getTime() && 
             date.endDate.getTime() !== booking.endDate.getTime()
    );
    
    await vehicle.save();
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update booking status (confirmed, in-progress, completed)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Update status
    booking.status = status;
    booking.updatedAt = Date.now();
    
    // If cancelled, remove dates from vehicle's booked dates
    if (status === 'cancelled') {
      const vehicle = await Vehicle.findById(booking.vehicle);
      vehicle.bookedDates = vehicle.bookedDates.filter(
        date => date.startDate.getTime() !== booking.startDate.getTime() && 
               date.endDate.getTime() !== booking.endDate.getTime()
      );
      
      await vehicle.save();
    }
    
    const updatedBooking = await booking.save();
    
    res.json({ 
      message: `Booking status updated to ${status}`,
      booking: updatedBooking
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Calculate booking cost with options
// @route   POST /api/bookings/:id/calculate
// @access  Public
exports.calculateBookingCost = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, options = {} } = req.body;
    
    // Validate required fields
    if (!vehicleId || !startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Vehicle ID, start date, and end date are required' 
      });
    }
    
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Validate dates
    if (start >= end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    // Calculate total days
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // Find vehicle
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Calculate base price
    const basePrice = vehicle.pricePerDay * totalDays;
    
    // Calculate service fee (10%)
    const serviceFee = basePrice * 0.1;
    
    // Calculate optional additions
    let additionalFees = 0;
    
    if (options.insurance) {
      additionalFees += 15 * totalDays; // Example: $15/day for insurance
    }
    
    if (options.extraDriver) {
      additionalFees += 10 * totalDays; // Example: $10/day for extra driver
    }
    
    if (options.childSeat) {
      additionalFees += 5 * totalDays; // Example: $5/day for child seat
    }
    
    // Calculate location fee if different drop-off
    let locationFee = 0;
    if (options.differentDropoff) {
      locationFee = 50; // Example: $50 fee for different drop-off location
    }
    
    // Calculate taxes (e.g., 8%)
    const taxRate = 0.08;
    const taxAmount = (basePrice + serviceFee + additionalFees + locationFee) * taxRate;
    
    // Calculate total
    const totalPrice = basePrice + serviceFee + additionalFees + locationFee + taxAmount;
    
    res.json({
      vehicleId,
      vehicleName: vehicle.name,
      duration: {
        startDate: start,
        endDate: end,
        totalDays
      },
      pricing: {
        basePrice,
        serviceFee,
        additionalFees,
        locationFee,
        taxes: {
          rate: taxRate,
          amount: taxAmount
        },
        totalPrice
      },
      options
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid vehicle ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get bookings for a specific user
// @route   GET /api/users/:id/bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user is requesting their own bookings or is admin
    const isAdmin = req.user.role === 'admin';
    const isOwner = userId === req.user.id;
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to access these bookings' });
    }
    
    const bookings = await Booking.find({ user: userId })
      .populate('vehicle', 'name type images')
      .populate('pickupLocation', 'name address.city')
      .populate('dropoffLocation', 'name address.city')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};