const express = require('express');
const router = express.Router();
const { upload } = require('../utils/fileHandler'); // File upload utility
const menuController = require('../controllers/menuController');

router.post('/:restaurantId/menu', menuController.addMenuItem);
router.post('/:menuItemId/image', upload.single('image'), menuController.uploadMenuItemImage);

module.exports = router;
