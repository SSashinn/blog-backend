const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/signup', authController.signUp_get);

router.post('/signup', authController.signUp_post);

router.post('/login', authController.login_post);


module.exports = router;