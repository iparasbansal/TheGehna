const express = require('express');
const router = express.Router();

// 1. Bring in our Manager (The Controller)
const productManager = require('../controllers/productController');

// 2. Bring in our Photographer (The Cloudinary Config)
const photographer = require('../config/cloudinary');

// --- THE CATALOG ---

// When someone just wants to SEE all jewelry
router.get('/', productManager.getProducts);

// When someone wants to ADD a new piece of jewelry (and upload a photo)
router.post('/', photographer.single('image'), productManager.createProduct);


// --- THE SPECIFIC ITEMS ---

// When someone clicks a specific item by its NAME (Slug)
router.get('/slug/:slug', productManager.getProductBySlug);

// When you want to CHANGE info for an item using its ID
router.put('/:id', photographer.single('image'), productManager.updateProduct);

// When you want to DELETE an item using its ID
router.delete('/:id', productManager.deleteProduct);

module.exports = router;