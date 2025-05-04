import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
});

const busSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  routeNumber: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  operator: {
    type: String,
    enum: ['hrtc', 'private', 'local', 'juit'],
    default: 'hrtc'
  },
  status: {
    type: String,
    enum: ['On Time', 'Delayed', 'Out of Service', 'Not Started'],
    default: 'On Time'
  },
  location: {
    type: pointSchema,
    required: true,
    
  },
  nextStop: {
    type: String,
    required: true
  },
  eta: {
    type: String,
    required: false
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  capacity: {
    type: Number,
    default: 40
  },
  occupancy: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  lastLocationUpdate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add the 2dsphere index
busSchema.index({ "location": "2dsphere" });

// Add any additional methods or statics here
busSchema.methods.updateLocation = function(lat, lng) {
  this.location.coordinates = [lng, lat]; // MongoDB uses [longitude, latitude] format
  this.lastLocationUpdate = Date.now();
  return this.save();
};

const Bus = mongoose.model('Bus', busSchema);
export default Bus;