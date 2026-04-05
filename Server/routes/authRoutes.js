const express = require('express');
const router = express.Router();

// 1. Import all functions from your Auth Controller
// Make sure these names match exactly what you wrote in controllers/authController.js
const { 
    register, 
    login, 
    forgotPassword, 
    getMe,
    resetPassword 
} = require('../controllers/authController');

// 2. Public Auth Routes
router.post('/register', register);
router.post('/login', login);

const { protect } = require('../middleware/auth'); // Import the protect middleware

// 3. Password Recovery Routes
// Note: forgotPassword uses POST because we are sending data (email)
router.post('/forgotpassword', forgotPassword);

router.get('/me', protect, getMe);

// Note: resetPassword uses PUT because we are updating an existing user's password
// The :resettoken is a URL parameter that will hold the unique string sent to Mailtrap
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;