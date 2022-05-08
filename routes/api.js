const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.post('/auth/signup', userController.validates('signUp'), userController.signUp);
router.post('/auth/email-confirm/:userId/:secretCode', userController.emailValidation);
router.post('/auth/revalidation-email', userController.validates('emailRevalidation'), userController.emailRevalidation);

module.exports = router;