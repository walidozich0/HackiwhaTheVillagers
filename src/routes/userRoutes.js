const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authMiddleware');
const { getUserById, updateUser, deleteUser, getUsers } = require('../controllers/userController');

// All routes are protected by authentication
router.use(authenticateUser);

// Get all users
router.get('/', getUsers);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

module.exports = router; 