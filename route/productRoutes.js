const { createProduct, uploadProductImage, getProducts } = require('../controller/products');
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Products = require('../model/Products');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults')

router.route('/:id/uploadimages')
    .put(uploadProductImage);

router.route('/merchant/:merchantId/product').post(protect, authorize('merchant', 'admin'), createProduct);

router.route('/products').get(advancedResults(Products, 'Merchants'), getProducts);
module.exports = router;