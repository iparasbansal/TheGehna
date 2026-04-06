const express = require('express');
const router = express.Router();
const productManager = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth'); 
const upload = require('../config/cloudinary'); 
const reviewRouter = require('./reviewRoutes');

// 1. Middleware Re-routing
router.use('/:productId/reviews', reviewRouter);

// 2. Collection Routes (Static paths go FIRST)
router.get('/', productManager.getProducts);

// --- NEW BULK ROUTE (Must be above /:id) ---
router.post(
    '/bulk', 
    protect, 
    authorize('admin'), 
    productManager.bulkInsertProducts
);

// 3. Single Product Management (Admin)
router.post(
    '/', 
    protect, 
    authorize('admin'), 
    upload.single('image'), 
    productManager.createProduct
);

// 4. Dynamic Parameter Routes (Go LAST)
router.get('/slug/:slug', productManager.getProductBySlug);
router.get('/:id', productManager.getSingleProduct);

router.put(
    '/:id', 
    protect, 
    authorize('admin'), 
    upload.single('image'), 
    productManager.updateProduct
);

router.delete(
    '/:id', 
    protect, 
    authorize('admin'), 
    productManager.deleteProduct
);

module.exports = router;