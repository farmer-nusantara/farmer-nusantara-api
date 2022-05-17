const userController = require('../controllers/userController');
const farmlandController = require('../controllers/farmlandController');
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

router.post('/farmland', auth, farmlandController.validates('createFamland'), farmlandController.createFarmland);
router.put('/farmland/:farmlandId', auth, farmlandController.validates('createFamland'), farmlandController.updateFarmland);

router.post('/file/uploads/:userId', auth, farmlandController.uploadImageToStorage);
router.delete('/file/uploads', auth, farmlandController.removeImageFromStorage);

module.exports = router;