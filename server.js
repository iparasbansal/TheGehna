const dns = require('node:dns/promises');           // Database connection error becasue of dns and mongo+srv syntax
dns.setServers(['8.8.8.8', '1.1.1.1']);             // Database connection error becasue of dns and mongo+srv syntax
                                                        

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();


app.use(cors());
app.use(express.json());



mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("THE GEHNA Database Connected!"))
    .catch(err => console.log("DB Connection Error:", err));



app.get('/', (req, res) => {
    res.send("THE GEHNA Server is Running...");
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server launched on http://localhost:${PORT}`));