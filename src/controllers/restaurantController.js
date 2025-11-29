const Restaurant = require('../models/Restaurant');

// Create Restaurant
exports.createRestaurant = async (req, res) => {
  const { name, address, contact } = req.body;
  const restaurant = new Restaurant({ name, address, contact });

  await restaurant.save();
  res.json({ success: true, message: 'Restaurant created successfully', data: restaurant });
};