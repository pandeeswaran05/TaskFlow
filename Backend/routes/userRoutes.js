const express = require('express');
const router = express.Router();

// ✅ safer import check (most common error fix)
const userController = require('../controllers/Usercontroller');

const {
  getProfile,
  updateProfile,
  changePassword,
  getSettings,
  updateSettings,
  deleteAccount,
} = userController;

// ✅ Debug check (VERY useful during errors)
if (
  !getProfile ||
  !updateProfile ||
  !changePassword ||
  !getSettings ||
  !updateSettings ||
  !deleteAccount
) {
  console.error('❌ One or more controller functions are missing in User controller');
}

// Routes
router.get('/me', getProfile);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.delete('/account', deleteAccount);

module.exports = router;