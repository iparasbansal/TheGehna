const Review = require('../models/Review');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asynchandler');

// @desc    Get all reviews for a product
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find({ product: req.params.productId }).populate({
        path: 'user',
        select: 'name'
    });

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

// @desc    Add a review
// @route   POST /api/v1/products/:productId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.product = req.params.productId;
    req.body.user = req.user.id;

    const product = await Product.findById(req.params.productId);

    if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    });
});