const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

module.exports = router;
