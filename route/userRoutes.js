const { register } = require('../controller/auth');
const express = require('express');

const router = express.Router();

router
    .post('/register', register);



module.exports = router;