const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    getMyOrders
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// All routes here are protected
router.use(protect);

router.route('/').post(addOrderItems);
router.route('/myorders').get(getMyOrders);
router.route('/:id').get(getOrderById);

module.exports = router;