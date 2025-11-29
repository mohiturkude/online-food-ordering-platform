const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const { saveFile } = require('../utils/fileHandler');

// Add a new menu item for a specific restaurant
exports.addMenuItem = async (req, res) => {
  const { restaurantId } = req.params;
  const { name, description, price, category, available } = req.body;

  // Check if the restaurant exists
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return res.status(404).json({ success: false, message: 'Restaurant not found' });
  }

  // Create a new menu item
  const newMenuItem = new MenuItem({
    name,
    description,
    price,
    category,
    available,
    restaurant: restaurantId
  });

  try {
    // Save the menu item to the database
    await newMenuItem.save();
    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      data: newMenuItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

// Upload image for a menu item
exports.uploadMenuItemImage = async (req, res) => {
  const { menuItemId } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    // Save the uploaded file
    const { fileName, filePath } = await saveFile(file);

    // Find the menu item by its ID
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    // Save the image path to the menu item
    menuItem.image = filePath;
    await menuItem.save();

    res.json({
      success: true,
      message: 'Menu image uploaded successfully',
      data: { fileName, filePath },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};