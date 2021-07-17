const { createMerchant, getMerchants } = require('../controller/merchant');
const express = require('express');
const { protect } = require('../middleware/auth');
const Merchants = require('../model/Merchants');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router();


router.route('/:userid/create-merchant').post(protect, createMerchant);
router.route('/').get(advancedResults(Merchants, 'products'), getMerchants);
module.exports = router;