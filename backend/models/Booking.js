const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalDays: {
    type: Number,
    required: true,
    min: 1
  },
  pickupLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  dropoffLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  serviceFee: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit-card', 'paypal', 'bank-transfer', null],
    default: null
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date
  },
  specialRequests: {
    type: String
  },
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

// Index for efficient user queries
bookingSchema.index({ user: 1 });

// Index for efficient vehicle and date-based queries
bookingSchema.index({ vehicle: 1, startDate: 1, endDate: 1 });

// Index for status-based queries
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);