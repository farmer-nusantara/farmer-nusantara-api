const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();

router.post('/auth/signup', userController.validates('signUp'), userController.signUp);
router.post('/auth/email-token-activation', userController.validates('sendTokenActivationAccount'), userController.sendTokenActivationAccount);
router.post('/auth/status-account', userController.changeStatusAccount);
router.post('/auth/signin', userController.validates('signIn'), userController.signIn);
router.post('/auth/token-reset', userController.validates('resetPassword'), userController.sendCodeResetPassword);

module.exports = router;