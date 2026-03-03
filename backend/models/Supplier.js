const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  contact: { type: String },
  email:   { type: String },
  phone:   { type: String },
  city:    { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', SupplierSchema);