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

const busStopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: pointSchema,
    required: true,
 
  },
  routes: [{
    type: String,
    required: true
  }],
  facilities: [{
    type: String,
    enum: ['shelter', 'bench', 'lighting', 'realtime_display', 'wheelchair_access'],
    default: []
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add the 2dsphere index
busStopSchema.index({ "location": "2dsphere" });

const BusStop = mongoose.model('BusStop', busStopSchema);
export default BusStop;