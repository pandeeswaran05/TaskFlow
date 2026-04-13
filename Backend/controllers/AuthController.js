const User = require('../models/Usermodel');
const { signToken } = require('../middleware/authMiddleware');

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Demo login shortcut
    if (email.toLowerCase() === 'demo@example.com' && password === 'demo') {
      const demoUser = {
        id: 'demo',
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '+91 98765 43210',
        createdAt: '01 Jan 2024',
        isDemo: true,
      };
      const token = signToken({ id: demoUser.id, email: demoUser.email, name: demoUser.name });
      return res.json({ token, user: demoUser });
    }

    // Find user (need password field explicitly)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken({ id: user._id.toString(), email: user.email, name: user.name });
    const userSafe = user.toJSON();

    res.json({ token, user: userSafe });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// POST /api/auth/register  (also /api/auth/signup for compatibility)
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ error: 'First name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const user = await User.create({
      name: `${firstName.trim()} ${(lastName || '').trim()}`.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      password,
    });

    const userSafe = user.toJSON();
    res.status(201).json({ message: 'Account created successfully', user: userSafe });
  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors)[0].message;
      return res.status(400).json({ error: msg });
    }
    res.status(500).json({ error: 'Server error during signup' });
  }
};

module.exports = { login, signup };