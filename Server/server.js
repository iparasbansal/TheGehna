// 1. ENVIRONMENT VARIABLES (CRITICAL: MUST BE LINE 1)
require('dotenv').config(); 

// 2. CORE MODULES & DNS CONFIG
const dns = require('node:dns/promises');           
dns.setServers(['8.8.8.8', '1.1.1.1']);             

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// 3. ROUTE & MIDDLEWARE IMPORTS (Now they can see the .env variables)
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// 4. GLOBAL MIDDLEWARE
app.use(helmet()); 
app.use(cors());   
app.use(express.json()); 

// Debugging Log to verify Cloudinary is ready
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log("💎 THE GEHNA Vault Check - API Key:", process.env.CLOUDINARY_API_KEY ? "✅ LOADED" : "❌ MISSING");
}

// 5. SECURITY & RATE LIMITING
const limiter = rateLimit({ 
    windowMs: 10 * 60 * 1000, 
    max: 500,
    message: "The Vault is temporarily locked due to too many requests. Try again in 10 mins."
});
app.use('/api', limiter);
app.use(hpp()); 

// 6. CUSTOM SECURITY SHIELD (NoSQL & XSS Protection)
app.use((req, res, next) => {
    const clean = (obj) => {
        if (obj instanceof Object) {
            for (const key in obj) {
                if (key.startsWith('$')) {
                    delete obj[key];
                } 
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

// 7. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("💎 THE GEHNA Database Connected!"))
    .catch(err => console.log("❌ DB Connection Error:", err));

// 8. API ROUTES
app.get('/', (req, res) => {
    res.send("THE GEHNA Server is Running... 🏛️");
});

// Route mounting
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

// 9. ERROR HANDLING (Must be last)
app.use(errorHandler);

// 10. LAUNCH
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`' THE GEHNA Server is live on port ${PORT}...`);
});