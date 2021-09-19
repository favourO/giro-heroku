const { createAccount, verify, login, getMe } = require('../controller/auth');
const express = require('express');

const { protect } = require('../middleware/auth')
const router = express.Router();

router
    .post('/register', createAccount)
    .post('/verify', verify)
    .post('/login', login)
    .get('/me', protect, getMe);




module.exports = router;