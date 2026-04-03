const Product = require('../models/Product');
const asyncHandler = require('../middleware/asynchandler');


exports.createProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        message: "Product added to THE GEHNA collection successfully",
        data: product
    });
});

exports.getProducts = asyncHandler(async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };

    // 2. Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // 3. Create query string to inject MongoDB operators ($gt, $gte, etc)
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // 4. Finding resource
    query = Product.find(JSON.parse(queryStr));

    // 5. SELECT FIELDS (e.g., ?select=name,price)
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // 6. SORTING (e.g., ?sort=-price)
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt'); // Default
    }

    // 7. Executing query
    const products = await query;

    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

exports.getProductBySlug = asyncHandler(async (req, res, next) => {
    const product = await Product.findOne({ slug: req.params.slug });

    // In Industry, if data is missing, we pass a custom error to next()
    if (!product) {
        res.status(404);
        throw new Error(`Product not found with slug: ${req.params.slug}`);
    }

    res.status(200).json({
        success: true,
        data: product
    });
});