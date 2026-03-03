const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  email:  { type: String, required: true, unique: true },
  role:   { type: String, default: 'Sales' },
  status: { type: String, default: 'Active' },
  joined: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);