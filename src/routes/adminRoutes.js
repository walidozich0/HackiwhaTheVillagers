const express = require('express');
const router = express.Router();
const { authenticateUser, isAdmin } = require('../middlewares/authMiddleware');
const {
  registerUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/adminController');

// All routes are protected by authentication and admin role
router.use(authenticateUser);
router.use(isAdmin);

// User management routes
router.post('/users', registerUser);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/users/stats', getUserStats);

module.exports = router; 