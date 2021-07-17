const { createMerchant, getMerchants } = require('../controller/merchant');
const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();


router.route('/:userid/create-merchant').post(protect, createMerchant);
router.route('/').get(getMerchants);
module.exports = router;