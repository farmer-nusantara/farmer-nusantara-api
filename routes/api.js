const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();

router.post('/auth/signup', userController.validates('signUp'), userController.signUp);
router.post('/auth/email-token-activation', userController.validates('sendTokenActivationAccount'), userController.sendTokenActivationAccount);
router.put('/auth/status-account', userController.changeStatusAccount);
router.post('/auth/signin', userController.validates('signIn'), userController.signIn);
router.post('/auth/email-token-reset', userController.validates('sendTokenActivationAccount'), userController.sendCodeResetPassword);
router.post('/auth/check-token-reset', userController.checkSecretCodeforResetPassword);
router.put('/auth/change-password', userController.validates('resetPassword'), userController.changePasswordAccount)
router.get('/auth/user/:userId', auth, userController.getDetailUser);

module.exports = router;