const dns = require('node:dns/promises');           // Database connection error becasue of dns and mongo+srv syntax
dns.setServers(['8.8.8.8', '1.1.1.1']);             // Database connection error becasue of dns and mongo+srv syntax                                            

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

//--------------------------------------------------
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
//--------------------------------------------------


require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();


if (process.env.NODE_ENV === 'development') {                           // morgan is a logging tool that helps us see details of incoming requests in the console, but we only want it in development mode to avoid cluttering production logs.
    app.use(morgan('dev'));                                             // because i was not getting any green marks and only getting red ones so inpite of adding console success everywhere i used this
}

//---------------------------------------------------------------------------------------------------------------
// app.use(xss());                          // These 5 are for security hardening, to prevent various types of attacks like NoSQL injection, XSS, and HTTP parameter pollution. 
app.use(helmet());                       // They help protect our application from common vulnerabilities and ensure that user input is sanitized and safe to use.

const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 100 });
app.use(limiter);
app.use(hpp());

// Manual NoSQL Injection Protection
app.use((req, res, next) => {
    const sanitize = (obj) => {
        if (obj instanceof Object) {
            for (const key in obj) {
                // If a key starts with $ (MongoDB operator), delete it
                if (key.startsWith('$')) {
                    delete obj[key];
                } else {
                    sanitize(obj[key]);
                }
            }
        }
    };
    // Sanitize Body and Params (Query is handled by our Controller logic)
    sanitize(req.body);
    sanitize(req.params);
    next();
});

// --- THE NEW SECURITY SHIELD ---
app.use((req, res, next) => {
    const clean = (obj) => {
        if (obj instanceof Object) {
            for (const key in obj) {
                // 1. Stop NoSQL Injection (Remove $ operators)
                if (key.startsWith('$')) {
                    delete obj[key];
                } 
                // 2. Stop XSS (Strip HTML tags from strings)
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
    // Note: We skip req.query to avoid the "Getter" crash in Node 24
    next();
});
// ----------------------------------------------------------------------------------------------------------

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("THE GEHNA Database Connected!"))
    .catch(err => console.log("DB Connection Error:", err));

const errorHandler = require('./middleware/errorMiddleware');

app.get('/', (req, res) => {
    res.send("THE GEHNA Server is Running...");
});

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/products', productRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server launched on http://localhost:${PORT}`));