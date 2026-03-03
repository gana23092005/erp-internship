const mongoose = require('mongoose');

const SalesOrderSchema = new mongoose.Schema({
  orderId:  { type: String, required: true, unique: true },
  customer: { type: String, required: true },
  date:     { type: String },
  status:   { type: String, default: 'Pending' },
  total:    { type: Number, default: 0 },
  items:    { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('SalesOrder', SalesOrderSchema);