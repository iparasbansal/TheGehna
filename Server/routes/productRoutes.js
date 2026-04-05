const express = require('express');
const router = express.Router();
const productManager = require('../controllers/productController');

// --- THE SECURITY GUARDS ---
const { protect, authorize } = require('../middleware/auth'); 

// --- THE IMAGE UPLOADER ---
// Make sure this matches your cloudinary.js export!
const upload = require('../config/cloudinary'); 

// Include other resource routers
const reviewRouter = require('./reviewRoutes');

// Re-route into other resource routers
router.use('/:productId/reviews', reviewRouter);

// --- THE CATALOG ---

// PUBLIC: Anyone can browse the 1-gram gold collection
router.get('/', productManager.getProducts);

// ADMIN ONLY: Create a product (Multer must come BEFORE the controller)
router.post(
    '/', 
    protect, 
    authorize('admin'), 
    upload.single('image'), // This must be a function
    productManager.createProduct
);

// --- THE SPECIFIC ITEMS ---

// PUBLIC: Get by Slug or ID
router.get('/slug/:slug', productManager.getProductBySlug);
router.get('/:id', productManager.getSingleProduct);

// ADMIN ONLY: Update or Delete
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