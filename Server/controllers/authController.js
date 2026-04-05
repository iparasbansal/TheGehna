const crypto = require('crypto');
const User = require('../models/User');
const asyncHandler = require('../middleware/asynchandler');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new user
// @route   POST /api/v1/users/register
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email: email.toLowerCase(),
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
// @route   POST /api/v1/users/login
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

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
// @route   POST /api/v1/users/forgotpassword
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
    }

    // Get reset token from User Model method
    const resetToken = user.getResetPasswordToken();

    // Save to DB (expires in 10 mins usually defined in Model)
    await user.save({ validateBeforeSave: false });

    // --- CRITICAL FIX: Point to Frontend UI (Port 5173) ---
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const message = `THE GEHNA - Password Reset\n\n` +
    `You are receiving this email because you requested a password reset for your account.\n\n` +
    `Please click the link below to reset your password:\n` +
    `${resetUrl}\n\n` +
    `If you did not request this, please ignore this email. Your password will remain unchanged.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'THE GEHNA - Password Reset Token',
            message,
        });

        res.status(200).json({ success: true, data: 'Email sent successfully' });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ success: false, error: 'Email could not be sent' });
    }
});

// @desc    Reset password
// @route   PUT /api/v1/users/resetpassword/:resettoken
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // 1. Hash the token from the URL to compare with DB
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    // 2. Find user with valid token and check expiry
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).json({ success: false, error: 'Invalid or expired token' });
    }

    // 3. Set new password (Model middleware will hash this automatically)
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // 4. Send new JWT so user is logged in immediately
    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token });
});

// @desc    Get current logged in user
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});