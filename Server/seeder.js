const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const connectAndRun = async (action) => {
  try {
    console.log('⏳ Connecting to THE GEHNA Vault...');
    // Explicitly use MONGO_URL
    await mongoose.connect(process.env.MONGO_URL);
    console.log('💎 Database Connection Established!');

    if (action === '-i') await importData();
    if (action === '-d') await deleteData();

  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    const productsData = JSON.parse(fs.readFileSync(`${__dirname}/_data/products.json`, 'utf-8'));
    // Auto-map user ID if needed
    const adminId = "69d15ce7a2c9e496230f51b1"; 
    const finalProducts = productsData.map(p => ({ ...p, user: adminId }));

    await Product.insertMany(finalProducts);
    console.log('✅ Collection Uploaded!');
    process.exit();
  } catch (err) {
    console.error('❌ Import Error:', err.message);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log('🗑️ Vault Cleared!');
    process.exit();
  } catch (err) {
    console.error('❌ Deletion Error:', err.message);
    process.exit(1);
  }
};

// Start the process
connectAndRun(process.argv[2]);