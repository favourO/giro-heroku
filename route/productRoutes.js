const { createProduct, uploadProductImage } = require('../controller/products');
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.route('/:id/uploadimages')
    .put(uploadProductImage);

router.route('/').post(protect, authorize('merchant', 'admin'), createProduct);
module.exports = router;