const Product = require('../models/Product');
const asyncHandler = require('../middleware/asynchandler');

// @desc    Get all products (with Search, Filter, & Sort)
// @route   GET /api/v1/products
exports.getProducts = asyncHandler(async (req, res, next) => {
    let query;

    // 1. Create a copy of req.query
    const reqQuery = { ...req.query };

    // 2. Fields to exclude from the "Filter" logic
    const removeFields = ['select', 'sort', 'page', 'limit', 'keyword']; // Added 'keyword' here
    removeFields.forEach(param => delete reqQuery[param]);

    // 3. KEYWORD SEARCH LOGIC (The "Search Bar" Fix)
    let searchFilter = {};
    if (req.query.keyword) {
        searchFilter = {
            $or: [
                { name: { $regex: req.query.keyword, $options: 'i' } },
                { description: { $regex: req.query.keyword, $options: 'i' } },
                { category: { $regex: req.query.keyword, $options: 'i' } }
            ]
        };
    }

    // 4. Create query string for advanced filtering ($gt, $gte, etc.)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // 5. Combine Search + Filters
    // We spread the searchFilter and the parsed filter object into the find() method
    query = Product.find({ ...searchFilter, ...JSON.parse(queryStr) });

    // 6. Select Fields (e.g., ?select=name,price)
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // 7. Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // 8. Pagination Logic
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // We must count documents based on the search/filter criteria, not the whole DB
    const total = await Product.countDocuments({ ...searchFilter, ...JSON.parse(queryStr) });

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const products = await query;

    // Pagination result
    const pagination = {};
    if (startIndex + products.length < total) { 
        pagination.next = { page: page + 1, limit }; 
    }
    if (startIndex > 0) { 
        pagination.prev = { page: page - 1, limit }; 
    }

    res.status(200).json({
        success: true,
        count: products.length,
        total,
        pagination,
        data: products
    });
});

// @desc    Get single product by slug
// @route   GET /api/v1/products/slug/:slug
exports.getProductBySlug = asyncHandler(async (req, res, next) => {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${req.params.slug}`);
    }

    res.status(200).json({ success: true, data: product });
});

// @desc    Create new product
// @route   POST /api/v1/products
// @desc    Create new product
// @route   POST /api/v1/products
exports.createProduct = asyncHandler(async (req, res, next) => {
    // 1. ADD THIS LINE: This grabs the ID from the 'protect' middleware
    req.body.user = req.user.id; 

    // 2. Handle the image from Cloudinary (Photographer)
    if (req.file) {
        req.body.images = [{ // This name 'images' MUST match the Schema
            url: req.file.path,
            public_id: req.file.filename
        }];
    }
    // 3. Now create the product (it now has the 'user' field filled)
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product
    });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// Inside controllers/productController.js

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Piece not found" });
    }

    let updateData = {
      name: req.body.name || product.name,
      price: req.body.price ? Number(req.body.price) : product.price,
      description: req.body.description || product.description,
      category: req.body.category || product.category
    };

    // --- THE FIX FOR PUBLIC_ID ERROR ---
    if (req.file) {
      console.log("Vault Update: New Image Received");
      
      // We map the Cloudinary data to match your Schema exactly
      updateData.images = [{
        url: req.file.path,
        public_id: req.file.filename // Multer-Cloudinary stores the ID here
      }];
      
      // If you also use a single 'image' string field:
      updateData.image = req.file.path; 
    } else {
      // If no new image, keep the existing array so validation doesn't fail
      updateData.images = product.images;
      updateData.image = product.image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData }, 
      {
        new: true,
        runValidators: true // This is what was triggering the error
      }
    );

    res.status(200).json({ success: true, data: updatedProduct });

  } catch (error) {
    console.error("VALIDATION ERROR:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error(`No item found with ID: ${req.params.id}`);
    }

    await product.deleteOne();

    res.status(200).json({ success: true, message: "Item removed" });
});

// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
// @access  Public
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "This masterpiece was not found in The Vault."
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error accessing The Vault."
    });
  }
};