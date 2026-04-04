const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Built-in Node tool

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false 
    },
    // ADD THESE TWO FIELDS BELOW:
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Scramble password before saving
// Password Encryption Middleware
// Encrypt password using bcrypt
// Encrypt password using bcrypt
// Encrypt password using bcrypt
// Encrypt password using bcrypt
UserSchema.pre('save', async function() {
    console.log('✨ Pre-save hook triggered...');

    // 1. If password is NOT modified, return immediately
    if (!this.isModified('password')) {
        console.log('⏩ Password not modified, skipping hash.');
        return; 
    }

    // 2. If password IS modified (Reset Flow), hash it
    try {
        console.log('🔐 Hashing new password...');
        const bcrypt = require('bcryptjs'); // Local require to ensure it exists
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log('✅ Hashing complete.');
    } catch (err) {
        console.error('❌ Hashing error:', err);
        throw err; // This will reject the promise and stop the hang
    }
});

// Generate ID Card (JWT)
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Check password
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate RAW string
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash the string and save to DB
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken; 
};

module.exports = mongoose.model('User', UserSchema);