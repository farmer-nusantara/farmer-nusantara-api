const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();

router.post('/auth/signup', userController.validates('signUp'), userController.signUp);
router.post('/auth/email-confirm/:userId/:secretCode', userController.emailValidation);
router.post('/auth/email-reconfirm', userController.validates('emailRevalidation'), userController.emailRevalidation);
router.post('/auth/signin', userController.validates('signIn'), userController.signIn);
router.post('/auth/token-reset', userController.validates('resetPassword'), userController.sendCodeResetPassword);

module.exports = router;