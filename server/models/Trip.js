import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  placeId: String,
  name: { type: String, required: true },
  address: String,
  lat: Number,
  lng: Number,
  notes: String,
  duration: Number,
  cost: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
});

const daySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  title: { type: String, default: '' },
  places: [placeSchema],
});

const tripSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: { type: String, required: true },
  destination: { type: String, required: true },
  coverImage: { type: String, default: '' },
  startDate: Date,
  endDate: Date,
  isPublic: { type: Boolean, default: false },
  clonedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    default: null,
  },
  budget: {
    total: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
  },
  days: [daySchema],
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;