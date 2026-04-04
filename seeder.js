const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const products = JSON.parse(fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8'));

// Import into DB
const importData = async () => {
  try {
    await Product.create(products);
    console.log('✅ Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('🗑️ Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}