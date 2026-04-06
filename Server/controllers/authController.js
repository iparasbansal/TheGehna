const crypto = require('crypto');
const User = require('../models/User');
const { OTP } = require("../models/OTP");
const asyncHandler = require('../middleware/asynchandler');
const sendEmail = require('../utils/sendEmail');
const nodemailer = require("nodemailer");

// @desc    Step 1: Send OTP to Email
exports.sendEmailOTP = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Please provide an email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ email: email.toLowerCase(), otp });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
        from: '"THE GEHNA Vault" <vault@thegehna.com>',
        to: email,
        subject: "Your Access Key to The Vault",
        html: `<div style="background:#050505; color:#d4a34d; padding:20px; text-align:center; font-family:serif;">
                <h1>THE GEHNA</h1>
                <p>Your One-Time Access Key is:</p>
                <h2 style="font-size:32px;">${otp}</h2>
               </div>`
    });

    res.status(200).json({ success: true, message: "OTP Sent successfully" });
});

// @desc    Step 2: Register user (Verify OTP first)
exports.register = asyncHandler(async (req, res, next) => {
    console.log("1. Registration Request Received:", req.body);
    const { name, email, password, role, otp } = req.body;

    if (!otp) return res.status(400).json({ success: false, error: 'OTP is required' });

    const validOTP = await OTP.findOne({ email: email.toLowerCase(), otp });
    console.log("2. OTP Validation Result:", validOTP);

    if (!validOTP) return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });

    console.log("3. Attempting to create user...");
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role
    });

    await OTP.deleteOne({ _id: validOTP._id });
    const token = user.getSignedJwtToken();
    console.log("4. Registration Successful.");
    
    res.status(201).json({ success: true, token });
});

// @desc    Login user
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token });
});

// @desc    Forgot password
// @desc    Forgot password (Standard Link Flow)
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const user = await User.findOne({ email });
    
    if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
    }

    // 1. Generate Reset Token (Model method)
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // 2. Create Reset URL (Pointing to your Frontend)
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // 3. Setup Transporter (Same as OTP)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    // 4. Send the Professional HTML Email
    try {
        await transporter.sendMail({
            from: '"THE GEHNA Vault" <vault@thegehna.com>',
            to: user.email,
            subject: "Reset Your Vault Access Key",
            html: `
            <div style="background:#050505; color:#d4a34d; padding:40px; text-align:center; font-family:serif; border: 1px solid #d4a34d;">
                <h1 style="letter-spacing: 5px;">THE GEHNA</h1>
                <p style="color: #ffffff; opacity: 0.8;">A password reset was requested for your account.</p>
                <div style="margin: 30px 0;">
                    <a href="${resetUrl}" style="background:#d4a34d; color:#050505; padding: 15px 25px; text-decoration:none; font-weight:bold; border-radius:5px; text-transform:uppercase;">
                        Reset Password
                    </a>
                </div>
                <p style="font-size: 10px; color: #ffffff; opacity: 0.5;">If you didn't request this, please ignore this email. This link expires in 10 minutes.</p>
            </div>`
        });

        res.status(200).json({ success: true, data: 'Reset link sent to email' });
    } catch (err) {
        console.error(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ success: false, error: 'Email could not be sent' });
    }
});

// @desc    Reset password (FIXED NAME HERE)
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const user = await User.findOne({ 
        resetPasswordToken, 
        resetPasswordExpire: { $gt: Date.now() } 
    });

    if (!user) return res.status(400).json({ success: false, error: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token });
});

// @desc    Get Current User
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});