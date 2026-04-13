const bcrypt = require('bcryptjs');
const User = require('../models/Usermodel');
const { signToken } = require('../middleware/authMiddleware');

// GET /api/users/me
const getProfile = async (req, res) => {
  try {
    if (req.user.id === 'demo') {
      return res.json({
        id: 'demo',
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '+91 98765 43210',
        createdAt: '01 Jan 2024',
        isDemo: true,
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.toJSON());
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    if (req.user.id === 'demo') {
      return res.status(403).json({ error: 'Demo users cannot edit profile' });
    }

    const { firstName, lastName, email, phone } = req.body;

    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ error: 'First name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email taken by another user
    const existing = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: req.user.id },
    });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use by another account' });
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: `${firstName.trim()} ${(lastName || '').trim()}`.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || '',
      },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'User not found' });

    const token = signToken({
      id: updated._id.toString(),
      email: updated.email,
      name: updated.name,
    });

    res.json({ user: updated.toJSON(), token });
  } catch (err) {
    console.error('updateProfile error:', err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email already in use by another account' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/users/password
const changePassword = async (req, res) => {
  try {
    if (req.user.id === 'demo') {
      return res.status(403).json({ error: 'Demo users cannot change password' });
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All password fields are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await user.comparePassword(oldPassword);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('changePassword error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/users/settings  (returns user settings/preferences — stored in user doc)
const getSettings = async (req, res) => {
  try {
    if (req.user.id === 'demo') {
      return res.json({ notifications: true, theme: 'light' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ notifications: true, theme: 'light', email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/users/settings
const updateSettings = async (req, res) => {
  try {
    if (req.user.id === 'demo') {
      return res.status(403).json({ error: 'Demo users cannot update settings' });
    }
    // For now, settings are lightweight (theme/notifications are frontend-only)
    res.json({ message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/users/account
const deleteAccount = async (req, res) => {
  try {
    if (req.user.id === 'demo') {
      return res.status(403).json({ error: 'Demo accounts cannot be deleted' });
    }

    const deleted = await User.findByIdAndDelete(req.user.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('deleteAccount error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile, changePassword, getSettings, updateSettings, deleteAccount };