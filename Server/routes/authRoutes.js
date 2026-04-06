const express = require('express');
const router = express.Router();

// 1. Import all functions from your Auth Controller
// Ensure these names match your authController.js exports exactly
const { 
    sendEmailOTP,
    register, 
    login, 
    forgotPassword, 
    getMe,
    resetPassword 
} = require('../controllers/authController');

// 2. Middleware for protected routes
const { protect } = require('../middleware/auth');

// --- AUTHENTICATION ROUTES ---

// Step 1: Request the OTP
router.post('/send-otp', sendEmailOTP);

// Step 2: Finalize Registration (Verify OTP + Create User)
router.post('/register', register);

// Standard Login
router.post('/login', login);

// --- PASSWORD RECOVERY ROUTES ---

// Sends the reset link/token to email
router.post('/forgotpassword', forgotPassword);

// Updates the password using the token from the email
router.put('/resetpassword/:resettoken', resetPassword);

// --- USER PROFILE ROUTES ---

// Get current logged-in user details (Protected)
router.get('/me', protect, getMe);

// 3. Export the router using CommonJS
module.exports = router;