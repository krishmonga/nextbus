import mongoose from 'mongoose';

const feedbackSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: false
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: false
    },
    type: {
      type: String,
      enum: ['rating', 'issue', 'suggestion', 'general'],
      required: true
    },
    rating: {
      overall: {
        type: Number,
        min: 1,
        max: 10,
        required: function() { return this.type === 'rating'; }
      },
      timeliness: {
        type: Number,
        min: 1,
        max: 10,
        required: false
      },
      cleanliness: {
        type: Number,
        min: 1,
        max: 10,
        required: false
      },
      driverBehavior: {
        type: Number,
        min: 1,
        max: 10,
        required: false
      },
      comfort: {
        type: Number,
        min: 1,
        max: 10,
        required: false
      }
    },
    title: {
      type: String,
      required: function() { 
        return this.type === 'issue' || this.type === 'suggestion'; 
      }
    },
    description: {
      type: String,
      required: true
    },
    images: [
      {
        url: String,
        caption: String
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'under_review', 'resolved', 'rejected'],
      default: 'pending'
    },
    adminResponse: {
      text: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      respondedAt: Date
    }
  },
  {
    timestamps: true
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;