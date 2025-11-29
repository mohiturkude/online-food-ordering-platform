const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);