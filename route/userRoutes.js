const { createAccount, verify, login, getMe } = require('../controller/auth');
const express = require('express');

const router = express.Router();

router
    .post('/register', createAccount)
    .post('/verify', verify)
    .post('/login', login);

router
    .route('/:id')
    .get(getMe)



module.exports = router;