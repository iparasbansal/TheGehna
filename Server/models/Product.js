const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema({
  // ... (Your existing fields: name, description, price, etc.)
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description can be longer for luxury items']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Necklace', 'Ring', 'Bangles', 'Earrings', 'Others']
  },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  averageRating: {
    type: Number,
    min: [0, 'Rating cannot be negative'], 
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// --- THE CRITICAL FIX ---
// Using an async function without the 'next' parameter 
// avoids the "next is not a function" error in modern Mongoose.
ProductSchema.pre('save', async function() {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
});

module.exports = mongoose.model('Product', ProductSchema);