const express = require('express');
const router = express.Router();
const { upload } = require('../utils/fileHandler'); // File upload utility
const menuController = require('../controllers/menuController');

// Add a new menu item for a specific restaurant
router.post('/:restaurantId/menu', menuController.addMenuItem);

// Upload Menu Item Image (only for restaurant owner)
router.post('/:menuItemId/image', upload.single('image'), menuController.uploadMenuItemImage);

module.exports = router;
