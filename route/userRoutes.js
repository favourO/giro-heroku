const { createAccount, verify, login } = require('../controller/auth');
const express = require('express');

const router = express.Router();

router
    .post('/register', createAccount)
    .post('/verify', verify)
    .post('/login', login);



module.exports = router;