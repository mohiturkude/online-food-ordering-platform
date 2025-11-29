const Order = require('../models/Order');

// Place Order
exports.placeOrder = async (req, res) => {
  const { customerId, restaurantId, items, paymentMethod } = req.body;

  let totalAmount = 0;
  for (const item of items) {
    totalAmount += item.price * item.quantity;
  }

  const order = new Order({ customer: customerId, restaurant: restaurantId, items, totalAmount, paymentMethod });
  await order.save();

  res.json({ success: true, message: 'Order placed successfully', data: order });
};