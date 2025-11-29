const jwt = require('jsonwebtoken');
const User = require('../models/Customer');

// Protect routes requiring authentication
const protect = async (req, res, next) => {
  let token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  token = token.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

const admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied, admin only' });
  }
  next();
};

module.exports = { protect, admin };