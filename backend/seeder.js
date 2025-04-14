const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('./models/Vehicle');
const Location = require('./models/Location');
const User = require('./models/User');
const Booking = require('./models/Booking');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'john123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'jane123',
    role: 'user'
  }
];

const locations = [
  {
    name: 'Downtown Rental Center',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001'
    },
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    contactInfo: {
      phone: '+1-555-123-4567',
      email: 'downtown@bookmytrip.com'
    },
    hours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '21:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '10:00', close: '16:00' }
    },
    active: true
  },
  {
    name: 'Airport Rental Center',
    address: {
      street: '5700 Airport Blvd',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      zipCode: '90045'
    },
    coordinates: {
      latitude: 33.9416,
      longitude: -118.4085
    },
    contactInfo: {
      phone: '+1-555-987-6543',
      email: 'lax@bookmytrip.com'
    },
    hours: {
      monday: { open: '06:00', close: '23:00' },
      tuesday: { open: '06:00', close: '23:00' },
      wednesday: { open: '06:00', close: '23:00' },
      thursday: { open: '06:00', close: '23:00' },
      friday: { open: '06:00', close: '23:00' },
      saturday: { open: '06:00', close: '23:00' },
      sunday: { open: '06:00', close: '23:00' }
    },
    active: true
  },
  {
    name: 'Beach Resort Rentals',
    address: {
      street: '8500 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      country: 'USA',
      zipCode: '33139'
    },
    coordinates: {
      latitude: 25.7617,
      longitude: -80.1918
    },
    contactInfo: {
      phone: '+1-555-765-4321',
      email: 'miami@bookmytrip.com'
    },
    hours: {
      monday: { open: '08:00', close: '19:00' },
      tuesday: { open: '08:00', close: '19:00' },
      wednesday: { open: '08:00', close: '19:00' },
      thursday: { open: '08:00', close: '19:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '08:00', close: '20:00' },
      sunday: { open: '09:00', close: '17:00' }
    },
    active: true
  }
];

// Import data to database
const importData = async () => {
  try {
    // Clear existing data
    await Vehicle.deleteMany();
    await Location.deleteMany();
    await User.deleteMany();
    await Booking.deleteMany();
    
    console.log('All existing data deleted');
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    
    console.log('Users imported');
    
    // Insert locations
    const createdLocations = await Location.insertMany(locations);
    console.log('Locations imported');
    
    // Create vehicles with references to locations
    const vehicles = [
      {
        name: 'Toyota Camry',
        type: 'car',
        images: ['camry1.jpg', 'camry2.jpg'],
        pricePerDay: 65,
        location: createdLocations[0]._id,
        seats: 5,
        fuelType: 'Hybrid',
        available: true,
        description: 'Comfortable mid-size sedan with excellent fuel economy.',
        features: ['Bluetooth', 'Backup Camera', 'Cruise Control', 'USB Port']
      },
      {
        name: 'Honda CR-V',
        type: 'car',
        images: ['crv1.jpg', 'crv2.jpg'],
        pricePerDay: 85,
        location: createdLocations[0]._id,
        seats: 5,
        fuelType: 'Petrol',
        available: true,
        description: 'Spacious SUV perfect for families or road trips.',
        features: ['Navigation', 'Bluetooth', 'Backup Camera', 'Cruise Control', 'Sunroof']
      },
      {
        name: 'Yamaha FZ',
        type: 'motorcycle',
        images: ['fz1.jpg', 'fz2.jpg'],
        pricePerDay: 45,
        location: createdLocations[1]._id,
        seats: 2,
        fuelType: 'Petrol',
        available: true,
        description: 'Sporty motorcycle for urban exploration.',
        features: ['Helmet Included', 'Saddlebags', 'Phone Mount']
      },
      {
        name: 'Tesla Model 3',
        type: 'car',
        images: ['tesla1.jpg', 'tesla2.jpg'],
        pricePerDay: 120,
        location: createdLocations[1]._id,
        seats: 5,
        fuelType: 'Electric',
        available: true,
        description: 'Luxury electric car with autopilot features.',
        features: ['Autopilot', 'Premium Sound', 'Heated Seats', 'Glass Roof']
      },
      {
        name: 'Sea Ray Sundancer',
        type: 'boat',
        images: ['searay1.jpg', 'searay2.jpg'],
        pricePerDay: 350,
        location: createdLocations[2]._id,
        seats: 8,
        fuelType: null,
        available: true,
        description: 'Luxury yacht for unforgettable day trips.',
        features: ['Captain Included', 'Bluetooth Stereo', 'Cooler', 'Swimming Platform']
      },
      {
        name: 'Mountain Bike',
        type: 'bicycle',
        images: ['bike1.jpg', 'bike2.jpg'],
        pricePerDay: 25,
        location: createdLocations[2]._id,
        seats: 1,
        fuelType: null,
        available: true,
        description: 'Premium mountain bike for trail exploration.',
        features: ['Helmet', 'Lock', 'Water Bottle', 'Repair Kit']
      }
    ];
    
    const createdVehicles = await Vehicle.insertMany(vehicles);
    console.log('Vehicles imported');
    
    // Create a sample booking
    const booking = {
      vehicle: createdVehicles[0]._id,
      user: createdUsers[1]._id,
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-05'),
      totalDays: 4,
      pickupLocation: createdLocations[0]._id, 
      dropoffLocation: createdLocations[0]._id,
      totalPrice: 260, // 65 x 4 days
      serviceFee: 26,  // 10% of total price
      status: 'confirmed',
      paymentStatus: 'paid',
    };
    
    await Booking.create(booking);
    console.log('Sample booking created');
    
    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data
const destroyData = async () => {
  try {
    await Vehicle.deleteMany();
    await Location.deleteMany();
    await User.deleteMany();
    await Booking.deleteMany();
    
    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}