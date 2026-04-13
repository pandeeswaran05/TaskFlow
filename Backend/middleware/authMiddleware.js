const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'TaskFlow-secret-key-2026';

const authenticate = (req, res, next) => {
  // ✅ FIXED (headers + safe check)
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'No authorization header',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required',
    });
  }

  // ✅ Allow demo token
  if (token === 'demo-token') {
    req.user = { id: 'demo', email: 'demo@example.com', name: 'Demo User' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { authenticate, signToken, JWT_SECRET };