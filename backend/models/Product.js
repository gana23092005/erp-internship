const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  sku:          { type: String, required: true, unique: true },
  price:        { type: Number, default: 0 },
  stock:        { type: Number, default: 0 },
  reorderLevel: { type: Number, default: 10 },
  category:     { type: String, default: 'General' }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);