const { userModel, secretCodeModel } = require('../models/userModel');
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const generateString = require('../utils/generateString');

module.exports = {
    signUp: async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.status.json({ errors: errors.array() });
                return;
            }
            const { email, firstName, lastName, password } = req.body;

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);

            const user = await userModel.create({
                email,
                firstName,
                lastName,
                hashPassword
            })

            const code = generateString(7);
            const secretCode = await secretCodeModel.create({
                email,
                code,
            })

            const userJson = res.json(user);
            const secretCodeJson = res.json(secretCode);

            return { user: userJson, secretCode: secretCodeJson }
        }catch (err) {
            return next(err);
        }
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
                    body('lastName').exists().trim(),
                    body('phone').exists().notEmpty().isNumeric().custom(value => {
                        return userModel.findOne({ 'phone': value }).then(user => {
                            if (user) {
                                return Promise.reject('Phone is already used');
                            }
                        })
                    }),
                    body('birth').exists().notEmpty(),
                ]
            }
        }
    }
}