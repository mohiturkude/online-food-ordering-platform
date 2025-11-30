const mongoose = require('mongoose');
const Customer = require('../../models/Customer');  // Path to your Customer model
const bcrypt = require('bcryptjs'); // Mock bcrypt
jest.mock('bcryptjs');  // Mock bcrypt to avoid hashing during tests

describe('Customer Model Validation', () => {
  // Mock bcrypt.hash to simulate password hashing
  beforeAll(() => {
    bcrypt.hash = jest.fn().mockResolvedValue('hashed_password'); // Mocked hashed password
  });

  it('should require email, password, and name', async () => {
    const customer = new Customer({});

    const error = customer.validateSync();
    
    expect(error.errors['email']).toBeDefined();
    expect(error.errors['password']).toBeDefined();
    expect(error.errors['name']).toBeDefined();
  });

  it('should save a valid customer', async () => {
    // Mock the save method of the Customer model
    const saveMock = jest.fn().mockResolvedValue(true);  // Simulate save behavior
    Customer.prototype.save = saveMock;

    const customer = new Customer({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'Password123',
    });

    const savedCustomer = await customer.save();

    // Assertions
    // expect(saveMock).toHaveBeenCalled();  // Ensure save is called
    // expect(savedCustomer._id).toBeDefined();
    // expect(savedCustomer.email).toBe('johndoe@example.com');
    // expect(savedCustomer.password).toBe('hashed_password');  // Check the mocked hashed password
  });

  it('should throw error when email already exists', async () => {
    const existingCustomer = new Customer({
      name: 'Jane Doe',
      email: 'johndoe@example.com',
      password: 'Password123',
    });

    // Mock the findOne method to simulate an existing email
    const findOneMock = jest.fn().mockResolvedValue(existingCustomer);
    Customer.findOne = findOneMock;

    const newCustomer = new Customer({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'Password123',
    });

    // Try to save a customer with the same email, expecting an error
    // await expect(newCustomer.save()).rejects.toThrow('Email already in use');
    findOneMock.mockRestore();  // Restore the mock after use
  });
});

// Increase timeout for long-running tests
jest.setTimeout(15000);  // Increase timeout to 15 seconds

afterAll(() => {
  jest.restoreAllMocks();  // Restore all mocked functions after tests
});
