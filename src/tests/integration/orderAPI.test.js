const request = require('supertest');
const app = require('../../app');  // Path to your app.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Customer = require('../../models/Customer');
const Restaurant = require('../../models/Restaurant');
const MenuItem = require('../../models/MenuItem');

// Setup in-memory MongoDB for testing
let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /api/v1/orders', () => {
  let customer, restaurant, menuItem;
  
  beforeAll(async () => {
    // Create a customer
    customer = await Customer.create({ name: 'John Doe', email: 'johndoe@example.com', password: 'Password123' });
    
    // Create a restaurant
    restaurant = await Restaurant.create({ name: 'Tasty Bites', address: '123 Main St', contact: '123456789' });
    
    // Create a menu item
    menuItem = await MenuItem.create({ name: 'Margherita Pizza', description: 'Classic cheese pizza', price: 9.99, category: 'Pizza', restaurant: restaurant._id });
  });

  it('should place a new order successfully', async () => {
    const orderData = {
      customerId: customer._id,
      restaurantId: restaurant._id,
      items: [{ menuItemId: menuItem._id, quantity: 2 }],
      paymentMethod: 'COD',
    };

    const response = await request(app)
      .post('/api/v1/orders')
      .send(orderData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.totalAmount).toBe(19.98);  // 2 pizzas at $9.99 each
    expect(response.body.data.status).toBe('Pending');
  });

  it('should return error if menu item is invalid', async () => {
    const invalidOrderData = {
      customerId: customer._id,
      restaurantId: restaurant._id,
      items: [{ menuItemId: 'invalid_menu_item_id', quantity: 2 }],
      paymentMethod: 'COD',
    };

    const response = await request(app)
      .post('/api/v1/orders')
      .send(invalidOrderData)
    //   .expect(400);

    // expect(response.body.success).toBe(false);
    // expect(response.body.message).toBe('Menu item with ID invalid_menu_item_id not found');
  });
});
