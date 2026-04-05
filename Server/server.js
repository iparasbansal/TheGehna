const dns = require('node:dns/promises');           
dns.setServers(['8.8.8.8', '1.1.1.1']);             

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// 1. GLOBAL MIDDLEWARE
app.use(helmet()); // Security Headers
app.use(cors());   // Allow Frontend Access
app.use(express.json()); // Parse JSON bodies

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Logging for IIITA Dev Environment
}

// 2. SECURITY & RATE LIMITING
// Increased limit to 500 to prevent 404/429 errors while you are testing/refreshing
const limiter = rateLimit({ 
    windowMs: 10 * 60 * 1000, 
    max: 500,
    message: "The Vault is temporarily locked due to too many requests. Try again in 10 mins."
});
app.use('/api', limiter);
app.use(hpp()); // Prevent HTTP Parameter Pollution

// 3. CUSTOM SECURITY SHIELD (NoSQL & XSS Protection)
app.use((req, res, next) => {
    const clean = (obj) => {
        if (obj instanceof Object) {
            for (const key in obj) {
                // Stop NoSQL Injection
                if (key.startsWith('$')) {
                    delete obj[key];
                } 
                // Stop XSS (Strip HTML tags)
                else if (typeof obj[key] === 'string') {
                    obj[key] = obj[key].replace(/<[^>]*>?/gm, ''); 
                }
                else {
                    clean(obj[key]);
                }
            }
        }
    };
    if (req.body) clean(req.body);
    if (req.params) clean(req.params);
    next();
});

// 4. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("💎 THE GEHNA Database Connected!"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// 5. API ROUTES
app.get('/', (req, res) => {
    res.send("THE GEHNA Server is Running... 🏛️");
});

// SYNCED: This now matches your Frontend calls to /api/v1/users/...
app.use('/api/v1/users', authRoutes);

app.use('/api/v1/products', productRoutes);

app.use('/api/v1/orders', orderRoutes);

// 6. ERROR HANDLING (Must be last)
app.use(errorHandler);

// 7. LAUNCH
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`' THE GEHNA Server is live on port ${PORT}...`);
});