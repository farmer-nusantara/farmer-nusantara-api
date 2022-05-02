const userModel = require('../models/userModel');
const { body } = require("express-validator");

module.exports = {
    signUp: (req, res, next) => {
        const { email, firstName, lastName, password, passwordConfirmation } = req.body;
    },
    validates: (method) => {
        switch (method) {
            case "signUp": {
                return [
                    body('email').exists().notEmpty().trim().normalizeEmail().isEmail().custom(value => {
                        return userModel.findOne({ 'email': value }).then(user => {
                            if (user) {
                                return Promise.reject('E-mail already in case');
                            }
                        })
                    }),
                    body('password').exists().isLength({ min: 8 }),
                    body('passwordConfirmation').exists().custom((value, { req }) => {
                        if (value !== req.body.password) {
                            throw new Error('Password confirmation does not match password');
                        }

                        return true;
                    }),
                    body('firstName').exists().notEmpty().trim(),
                    body('lastName').exists().notEmpty().trim(),
                ]
            }
        }
    }
}