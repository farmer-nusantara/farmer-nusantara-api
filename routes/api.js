const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.post('/signup', userController.validates('signUp'), userController.signUp);
router.get('/email-confirm/:userId/:secretCode', userController.emailValidation);
router.post('/revalidation-email', userController.validates('emailRevalidation'), userController.emailRevalidation);

module.exports = router;