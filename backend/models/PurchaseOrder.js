const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
  orderId:  { type: String, required: true, unique: true },
  supplier: { type: String, required: true },
  date:     { type: String },
  status:   { type: String, default: 'Ordered' },
  total:    { type: Number, default: 0 },
  items:    { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);