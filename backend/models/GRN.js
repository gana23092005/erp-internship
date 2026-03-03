const mongoose = require('mongoose');

const GRNSchema = new mongoose.Schema({
  grnId:    { type: String, required: true, unique: true },
  poId:     { type: String, required: true },
  supplier: { type: String },
  date:     { type: String },
  items:    { type: Number, default: 0 },
  status:   { type: String, default: 'Completed' }
}, { timestamps: true });

module.exports = mongoose.model('GRN', GRNSchema);