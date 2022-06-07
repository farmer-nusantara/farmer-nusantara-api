const userController = require('../controllers/userController');
const farmlandController = require('../controllers/farmlandController');
const sickPlantController = require('../controllers/sickPlantController');
const auth = require('../middlewares/auth');
const express = require('express');
const adminPanelController = require('../controllers/adminPanelController');
const router = express.Router();

router.post('/auth/signup', userController.validates('signUp'), userController.signUp);
router.post('/auth/email-token-activation', userController.validates('sendTokenActivationAccount'), userController.sendTokenActivationAccount);
router.put('/auth/status-account', userController.changeStatusAccount);
router.post('/auth/signin', userController.validates('signIn'), userController.signIn);
router.post('/auth/email-token-reset', userController.validates('sendTokenActivationAccount'), userController.sendCodeResetPassword);
router.post('/auth/check-token-reset', userController.checkSecretCodeforResetPassword);
router.put('/auth/change-password', userController.validates('resetPassword'), userController.changePasswordAccount);
router.get('/auth/user/:userId', auth, userController.getDetailUser);
router.delete('/auth/users', userController.removeAllAccounts);
router.put('/auth/user/:userId', auth, userController.validates("editProfile"), userController.editProfile);

router.post('/farmland', auth, farmlandController.validates('createFamland'), farmlandController.createFarmland);
router.get('/farmland/:farmlandId', auth, farmlandController.showFarmlandById);
router.get('/farmland', auth, farmlandController.showAllFarmlandByOwner);
router.put('/farmland/:farmlandId', auth, farmlandController.validates('createFamland'), farmlandController.updateFarmland);
router.delete('/farmland/:farmlandId', auth, farmlandController.removeFarmland);

router.post('/plants', auth, sickPlantController.validates('createSickPlant'), sickPlantController.createSickPlant)
router.get('/plants/:sickPlantId', auth, sickPlantController.getSickPlant);
router.get('/plants', auth, sickPlantController.getAllSickPlants);
router.delete('/plants/:farmlandId', auth, sickPlantController.removeSickPlant);

router.post('/file/uploads/:userId', auth, farmlandController.uploadImageToStorage);
router.delete('/file/uploads', auth, farmlandController.removeImageFromStorage);

router.get('/model', auth, adminPanelController.getModels);
router.post('/model', auth, adminPanelController.validates('addModel'), adminPanelController.addModel);
router.put('/model/:id', auth, adminPanelController.validates('editModel'), adminPanelController.editModel);
router.delete('/model/:id', auth, adminPanelController.deleteModel);

router.get('/articles', auth, adminPanelController.getArticles);
router.get('/articles/:id', auth, adminPanelController.getArticleById);
router.post('/articles', auth, adminPanelController.validates('addArticle'), adminPanelController.addArticle);
router.put('/articles/:id', auth, adminPanelController.validates('addArticle'), adminPanelController.editArticle);
router.delete('/articles/:id', auth, adminPanelController.deleteArticle);

router.get('/faq', auth, adminPanelController.getFaqs);
router.post('/faq', auth, adminPanelController.validates('addFaq'), adminPanelController.addFaq);
router.put('/faq/:id', auth, adminPanelController.validates('addFaq'), adminPanelController.editFaq);
router.post('/faq/:id', auth, adminPanelController.deleteFaq);
router.get('/dashboard', auth, adminPanelController.getDashboardData);

module.exports = router;