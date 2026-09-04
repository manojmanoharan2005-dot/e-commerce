import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  requestedQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  expectedPrice: {
    type: Number
  },
  offeredPrice: {
    type: Number
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'accepted', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Quote', quoteSchema);