const { createProduct, uploadProductImage, getProducts} = require('../controller/products');
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Products = require('../model/Products');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

// const storage = multer.diskStorage({ 
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         const fileName = file.originalname
//         const suffix = unique(fileName)
//         const uniqueSuffix = Date.now() + '&' + suffix
//         cb(null, file.originalname + '*' + uniqueSuffix)
//     }
// })

const router = express.Router();

const advancedResults = require('../middleware/advancedResults')

router.route('/:id/uploadimages')
    .post(protect, authorize('merchant', 'admin'), upload.array('avatar', 10), uploadProductImage);

router.route('/merchant/:merchantId/product').post(protect, authorize('merchant', 'admin'), upload.array('avatar', 10), createProduct);

router.route('/products').get(advancedResults(Products, 'Merchants'), getProducts);

router.route('/:d').get()
module.exports = router;