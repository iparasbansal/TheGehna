const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 300 // 5 minutes TTL (Time To Live) index
  }
});

// Create and export the model
const OTP = mongoose.model('OTP', otpSchema);
module.exports = { OTP };