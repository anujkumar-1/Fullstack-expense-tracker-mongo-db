import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const forgotPasswordSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4 // sets UUID as _id
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  _id: false // since you're manually using UUID instead of ObjectId
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

export default ForgotPassword;
