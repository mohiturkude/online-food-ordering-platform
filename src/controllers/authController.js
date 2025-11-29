const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Customer = require('../models/Customer');

// Register Customer
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    return res.status(400).json({ success: false, message: 'Email already in use' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new customer instance
  const newCustomer = new Customer({
    name,
    email,
    password: hashedPassword,
  });

  try {
    // Save the new customer to the database
    await newCustomer.save();

    // Generate JWT tokens
    const accessToken = jwt.sign({ id: newCustomer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: newCustomer._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

// Login Customer
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Find the customer by email
  const customer = await Customer.findOne({ email });
  if (!customer) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' });
  }

  // Compare the provided password with the hashed password
  const isMatch = await bcrypt.compare(password, customer.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' });
  }

  // Generate JWT tokens after successful login
  const accessToken = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({
    success: true,
    message: 'Login successful',
    data: { accessToken, refreshToken },
  });
};