const express = require('express');
const router = express.Router();

const { 
    createProduct, 
    getProducts, 
    getProductBySlug 
} = require('../controllers/productController');


router.route('/')
    .get(getProducts)
    .post(createProduct);

    
router.get('/:slug', getProductBySlug);

module.exports = router;