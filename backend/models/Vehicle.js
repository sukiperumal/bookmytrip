const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['car', 'motorcycle', 'bicycle', 'boat'],
    index: true
  },
  images: [String],
  pricePerDay: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [reviewSchema],
  reviewCount: {
    type: Number,
    default: 0
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', null]
  },
  available: {
    type: Boolean,
    default: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  features: [String],
  bookedDates: [{
    startDate: Date,
    endDate: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create index for search
vehicleSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Vehicle', vehicleSchema);