import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['registered', 'under_review', 'in_progress', 'resolved'],
    required: true,
  },
  note: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved'],
      default: 'pending',
    },
    timeline: {
      type: String,
      enum: ['registered', 'under_review', 'in_progress', 'resolved'],
      default: 'registered',
    },
    statusHistory: [statusHistorySchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

complaintSchema.pre('save', function (next) {
  if (this.isNew) {
    this.statusHistory = [
      { status: 'registered', note: 'Complaint registered successfully' },
    ];
  }
  next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
