const crypto = require('crypto');
const User = require('../models/User');
const asyncHandler = require('../middleware/asynchandler');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
        success: true,
        token
    });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token
    });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    console.log('Type of next:', typeof next);
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        // We use 'return' to stop execution and send the response
        return res.status(404).json({ success: false, error: "User not found" });
    }

    // Get reset token from User Model method
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset URL (This will be the link in the email)
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you requested a password reset for THE GEHNA. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ success: false, error: 'Email could not be sent' });
    }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');


    let user;
    try {
        // We use .exec() to ensure Mongoose returns a real Promise
        user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        }).exec(); 
    } catch (dbError) {
        console.error('❌ Database Query Error:', dbError.message);
        return res.status(500).json({ success: false, error: 'Database error' });
    }

    if (!user) {
        return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token });
});