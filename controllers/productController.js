const Product = require('../models/Product');
const asyncHandler = require('../middleware/asynchandler');

// @desc    Get all products (with Search, Filter, & Sort)
// @route   GET /api/v1/products
exports.getProducts = asyncHandler(async (req, res, next) => {
    let query;

    // 1. Create a copy of req.query
    const reqQuery = { ...req.query };

    // 2. Fields to exclude from the "Filter" (we handle these separately)
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // 3. Create query string with MongoDB operators ($gt, $gte, etc.)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // 4. Finding resource in Database
    query = Product.find(JSON.parse(queryStr));

    // 5. Select Fields (e.g., ?select=name,price)
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // 6. Sort (e.g., ?sort=-price for High to Low)
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt'); // Default: Newest first
    }

    // 7. Pagination Logic
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const products = await query;

    // Pagination result (helpful for Frontend buttons)
    const pagination = {};
    if (endIndex < total) { pagination.next = { page: page + 1, limit }; }
    if (startIndex > 0) { pagination.prev = { page: page - 1, limit }; }

    res.status(200).json({
        success: true,
        count: products.length,
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
exports.createProduct = asyncHandler(async (req, res, next) => {
    if (req.file) {
        req.body.images = [{
            url: req.file.path,
            public_id: req.file.filename
        }];
    }

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product
    });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
exports.updateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error(`No item found with ID: ${req.params.id}`);
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: product });
});

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