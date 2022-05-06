const userController = require('../controllers/userController');
const express = require('express');
const router = express.Router();

router.post('/signup', userController.validates('signUp'), userController.signUp);
router.get('/email-confirm/:userId/:secretCode', userController.emailValidation);

module.exports = router;