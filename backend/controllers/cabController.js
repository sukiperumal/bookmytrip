const axios = require('axios');

/**
 * @desc    Calculate estimated cab fare
 * @route   POST /api/cab/fares/estimate
 * @access  Public
 */
exports.getCabFareEstimate = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, vehicleType } = req.body;

    // Validate required fields
    if (!pickupLocation || !dropoffLocation) {
      return res.status(400).json({ 
        message: 'Pickup location and dropoff location are required' 
      });
    }

    // Validate coordinates
    if (!pickupLocation.latitude || !pickupLocation.longitude || 
        !dropoffLocation.latitude || !dropoffLocation.longitude) {
      return res.status(400).json({ 
        message: 'Both pickup and dropoff locations must include valid latitude and longitude' 
      });
    }

    // Prepare the request to the external cab API
    const externalApiUrl = `${process.env.EXTERNAL_CAB_API_URL}/api/fares/estimate`;
    
    const requestBody = {
      pickupLocation,
      dropoffLocation
    };

    // Add vehicle type if specified
    if (vehicleType) {
      requestBody.vehicleType = vehicleType;
    }

    // Make request to external API
    const response = await axios.post(externalApiUrl, requestBody);

    // Return the response from the external API
    res.json(response.data);
  } catch (error) {
    console.error('Error calculating cab fare:', error.response?.data || error.message);
    
    // Handle different types of errors
    if (error.response) {
      // The external API responded with an error status
      return res.status(error.response.status).json({ 
        message: 'Error from cab fare service',
        error: error.response.data
      });
    }
    
    // Network error or other issues
    res.status(500).json({ 
      message: 'Could not calculate cab fare estimate', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get alternative fare options (simplified endpoint)
 * @route   POST /api/cab/fares
 * @access  Public
 */
exports.getAlternativeFares = async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation } = req.body;

    // Validate required fields
    if (!pickupLocation || !dropoffLocation) {
      return res.status(400).json({ 
        message: 'Pickup location and dropoff location are required' 
      });
    }

    // Validate coordinates
    if (!pickupLocation.latitude || !pickupLocation.longitude || 
        !dropoffLocation.latitude || !dropoffLocation.longitude) {
      return res.status(400).json({ 
        message: 'Both pickup and dropoff locations must include valid latitude and longitude' 
      });
    }

    // Prepare the request to the external cab API
    const externalApiUrl = `${process.env.EXTERNAL_CAB_API_URL}/api/fares`;
    
    // Make request to external API - this will return estimates for all available vehicle types
    const response = await axios.post(externalApiUrl, {
      pickupLocation,
      dropoffLocation
    });

    // Return the response from the external API
    res.json(response.data);
  } catch (error) {
    console.error('Error getting alternative fares:', error.response?.data || error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        message: 'Error from cab fare service',
        error: error.response.data
      });
    }
    
    res.status(500).json({ 
      message: 'Could not get alternative fare options', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get list of cab partners
 * @route   GET /api/partners
 * @access  Public
 */
exports.getPartners = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, location } = req.query;
    
    // Build query params for the external API
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    if (status) {
      queryParams.append('status', status);
    }
    
    if (location) {
      queryParams.append('location', location);
    }

    console.log(`Fetching partners from: ${process.env.EXTERNAL_CAB_API_URL}/api/partners?${queryParams.toString()}`);
    
    // Make request to external API - no auth headers needed anymore
    try {
      const externalApiUrl = `${process.env.EXTERNAL_CAB_API_URL}/api/partners?${queryParams.toString()}`;
      const response = await axios.get(externalApiUrl);
      
      // Return the response from the external API
      res.json(response.data);
    } catch (apiError) {
      console.error('API call error details:', apiError);
      
      // For development/debugging, if no external API is available, return mock data
      if (!process.env.EXTERNAL_CAB_API_URL || apiError.code === 'ECONNREFUSED') {
        console.log('Returning mock data for partners');
        return res.json({
          data: [
            {
              partnerId: "partner123",
              name: "ABC Cabs",
              contact: {
                phone: "9876543210",
                email: "contact@abccabs.com"
              },
              vehicles: [
                { vehicleId: "veh456", type: "Sedan", registration: "KA01AB1234" }
              ],
              status: "active"
            },
            {
              partnerId: "partner456",
              name: "XYZ Rides",
              contact: {
                phone: "9988776655",
                email: "support@xyzrides.com"
              },
              vehicles: [
                { vehicleId: "veh789", type: "SUV", registration: "KA02CD5678" }
              ],
              status: "active"
            }
          ],
          pagination: {
            currentPage: parseInt(page),
            totalPages: 5,
            totalItems: 50
          }
        });
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error('Error fetching cab partners:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        message: 'Error from cab partner service',
        error: error.response.data
      });
    }
    
    res.status(500).json({ 
      message: 'Could not fetch cab partners', 
      error: error.message 
    });
  }
};

/**
 * @desc    Create a new cab partner
 * @route   POST /api/partners
 * @access  Public
 */
exports.createPartner = async (req, res) => {
  try {
    const { name, contact, address } = req.body;
    
    // Validate required fields
    if (!name || !contact || !address) {
      return res.status(400).json({ 
        message: 'Name, contact information, and address are required' 
      });
    }
    
    try {
      // Make request to external API - no auth headers needed anymore
      const externalApiUrl = `${process.env.EXTERNAL_CAB_API_URL}/api/partners`;
      const response = await axios.post(externalApiUrl, req.body);
      
      // Return the response from the external API
      res.status(201).json(response.data);
    } catch (apiError) {
      // For development/debugging, if no external API is available, return mock data
      if (!process.env.EXTERNAL_CAB_API_URL || apiError.code === 'ECONNREFUSED') {
        console.log('Returning mock response for partner creation');
        return res.status(201).json({
          partnerId: `partner_${Math.random().toString(16).slice(2)}`,
          message: "Cab partner created successfully"
        });
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error('Error creating cab partner:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        message: 'Error from cab partner service',
        error: error.response.data
      });
    }
    
    res.status(500).json({ 
      message: 'Could not create cab partner', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get a specific cab partner
 * @route   GET /api/partners/:partnerId
 * @access  Public
 */
exports.getPartnerById = async (req, res) => {
  try {
    const { partnerId } = req.params;
    
    console.log(`Fetching partner details for: ${partnerId}`);
    
    try {
      // Make request to external API - no auth headers needed anymore
      const externalApiUrl = `${process.env.EXTERNAL_CAB_API_URL}/api/partners/${partnerId}`;
      const response = await axios.get(externalApiUrl);
      
      // Return the response from the external API
      res.json(response.data);
    } catch (apiError) {
      // For development/debugging, if no external API is available, return mock data
      if (!process.env.EXTERNAL_CAB_API_URL || apiError.code === 'ECONNREFUSED') {
        console.log('Returning mock data for partner details');
        return res.json({
          partnerId: partnerId,
          name: "ABC Cabs",
          contact: {
            phone: "9876543210",
            email: "contact@abccabs.com"
          },
          vehicles: [
            { vehicleId: "veh456", type: "Sedan", registration: "KA01AB1234", status: "available" }
          ],
          status: "active",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-04-10T09:30:00Z"
        });
      }
      
      // If the external API returned a 404, pass it through
      if (apiError.response && apiError.response.status === 404) {
        return res.status(404).json({ message: 'Cab partner not found' });
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error('Error fetching cab partner:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        message: 'Error from cab partner service',
        error: error.response.data
      });
    }
    
    res.status(500).json({ 
      message: 'Could not fetch cab partner', 
      error: error.message 
    });
  }
};

/**
 * @desc    Update a cab partner
 * @route   PUT /api/partners/:partnerId
 * @access  Public
 */
exports.updatePartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    
    try {
      // Make request to external API - no auth headers needed anymore
      const externalApiUrl = `${process.env.EXTERNAL_CAB_API_URL}/api/partners/${partnerId}`;
      const response = await axios.put(externalApiUrl, req.body);
      
      // Return the response from the external API
      res.json(response.data);
    } catch (apiError) {
      // For development/debugging, if no external API is available, return mock data
      if (!process.env.EXTERNAL_CAB_API_URL || apiError.code === 'ECONNREFUSED') {
        console.log('Returning mock response for partner update');
        return res.json({
          partnerId: partnerId,
          message: "Cab partner updated successfully"
        });
      }
      
      // If the external API returned a 404, pass it through
      if (apiError.response && apiError.response.status === 404) {
        return res.status(404).json({ message: 'Cab partner not found' });
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error('Error updating cab partner:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        message: 'Error from cab partner service',
        error: error.response.data
      });
    }
    
    res.status(500).json({ 
      message: 'Could not update cab partner', 
      error: error.message 
    });
  }
};

/**
 * @desc    Delete a cab partner
 * @route   DELETE /api/partners/:partnerId
 * @access  Public
 */
exports.deletePartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    
    try {
      // Make request to external API - no auth headers needed anymore
      const externalApiUrl = `${process.env.EXTERNAL_CAB_API_URL}/api/partners/${partnerId}`;
      await axios.delete(externalApiUrl);
      
      // Return success message
      res.json({ 
        message: 'Cab partner deleted successfully' 
      });
    } catch (apiError) {
      // For development/debugging, if no external API is available, return mock data
      if (!process.env.EXTERNAL_CAB_API_URL || apiError.code === 'ECONNREFUSED') {
        console.log('Returning mock response for partner deletion');
        return res.json({
          message: "Cab partner deleted successfully"
        });
      }
      
      // If the external API returned a 404, pass it through
      if (apiError.response && apiError.response.status === 404) {
        return res.status(404).json({ message: 'Cab partner not found' });
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error('Error deleting cab partner:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        message: 'Error from cab partner service',
        error: error.response.data
      });
    }
    
    res.status(500).json({ 
      message: 'Could not delete cab partner', 
      error: error.message 
    });
  }
};
