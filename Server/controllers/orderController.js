const Order = require('../models/Order');
const asyncHandler = require('../middleware/asynchandler');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.addOrderItems = asyncHandler(async (req, res, next) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    const order = new Order({
        orderItems,
        user: req.user.id, // Linked from your 'protect' middleware
        shippingAddress,
        paymentMethod,
        totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json({ success: true, data: createdOrder });
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    res.status(200).json({ success: true, data: order });
});

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });
    res.status(200).json({ success: true, data: orders });
});