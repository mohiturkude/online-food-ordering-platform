const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Place Order
exports.placeOrder = async (req, res) => {
  const { customerId, restaurantId, items, paymentMethod } = req.body;

  // Validate items and calculate totalAmount
  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    // Fetch menu item details from the database
    const menuItem = await MenuItem.findById(item.menuItemId);
    if (!menuItem) {
      return res.status(400).json({ success: false, message: `Menu item with ID ${item.menuItemId} not found` });
    }

    // Calculate the price for the current item and add it to totalAmount
    const itemTotal = menuItem.price * item.quantity;
    totalAmount += itemTotal;

    // Add menuItem with quantity and price to the order items
    orderItems.push({
      menuItem: menuItem._id,
      quantity: item.quantity,
      price: menuItem.price
    });
  }

  // Create new order
  const order = new Order({
    customer: customerId,
    restaurant: restaurantId,
    items: orderItems,
    totalAmount,
    paymentMethod
  });

  try {
    // Save the order to the database
    await order.save();

    res.json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};