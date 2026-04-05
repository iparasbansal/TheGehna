const jwt = require('jsonwebtoken');
const asyncHandler = require('./asynchandler');
const User = require('../models/User');

// Protect routes - Verify the JWT token
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if token exists in the Authorization header (Bearer Token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        // Verify token against your JWT_SECRET in .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user to the request object so controllers can use it
        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
});

// Grant access to specific roles (like 'admin')
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                error: `User role ${req.user.role} is not authorized to perform this action` 
            });
        }
        next();
    };
};