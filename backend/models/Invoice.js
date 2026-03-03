const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true, unique: true },
  soId:      { type: String },
  customer:  { type: String, required: true },
  date:      { type: String },
  due:       { type: String },
  amount:    { type: Number, default: 0 },
  status:    { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);