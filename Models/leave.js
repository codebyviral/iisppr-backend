import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
    internid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
  leaveType: {
    type: String,
    required: true,
    enum: ['Sick Leave', 'Personal Leave', 'Vacation', 'Other']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
 
  updatedBy: {
    type: String,
    default: null
  },
  updatedAt: {
    type: Date,
    default: null
  }
});
export default mongoose.model('Leave', leaveSchema);

