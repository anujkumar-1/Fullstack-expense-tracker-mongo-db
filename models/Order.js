import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  paymentstatus: {
    type: String,
    default: 'pending'
  },
  orderid: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'created'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // reference to User collection
    required: true
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;