const { userModel, secretCodeModel } = require('../models/userModel');
const { validationResult, check } = require("express-validator");
const bcrypt = require('bcryptjs');
const generateString = require('../utils/generateString');

module.exports = {
    signUp: async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                return;
            }
            const { email, firstName, lastName, password, birth, phone } = req.body;

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);

            const user = await userModel.create({
                email,
                firstName,
                lastName,
                password: hashPassword,
                birth,
                phone
            })

            const code = generateString(7);
            const secretCode = await secretCodeModel.create({
                email,
                code,
            })

            return res.status(200).json({ user, secretCode });
        }catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    emailValidation: async (req, res, next) => {
        try {
            const { userId, secretCode } = req.params;

            const checkCode = await secretCodeModel.findOne({ code: secretCode });

            if (checkCode) {
                const user = await userModel.findOneAndUpdate({ _id: userId }, { status: 'active' });
                return res.status(201).json(user);
            }

        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    emailRevalidation: async (req, res, next) => {
        try {
            const { email } = req.body;

            const user = await userModel.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'E-mail not registered' })
            }

            const code = generateString(7);
            const secretCode = await secretCodeModel.create({
                email,
                code,
            })

            return res.status(200).json({ secretCode });
        } catch (error) {
            return res.status(400).json({ message: err.message });
        }
    },
    validates: (method) => {
        switch (method) {
            case "signUp": {
                return [
                    check('email')
                        .exists()
                        .withMessage('Email is required')
                        .notEmpty()
                        .trim()
                        .withMessage('Email not null & not whitespace')
                        .isEmail()
                        .withMessage('Email not valid')
                        .custom(value => {
                            return userModel.findOne({ 'email': value }).then(user => {
                                if (user) {
                                    return Promise.reject('E-mail already in case');
                                }
                            })
                        }),
                    check('password')
                        .exists()
                        .withMessage('Password is required')
                        .isLength({ min: 8 })
                        .withMessage('Password min 8 length'),
                    check('passwordConfirmation')
                        .exists()
                        .withMessage('Password Confirmation is required')
                        .custom((value, { req }) => {
                        if (value !== req.body.password) {
                            throw new Error('Password confirmation does not match password');
                        }

                            return true;
                        }),
                    check('firstName')
                        .exists()
                        .withMessage('firstName is required')
                        .notEmpty()
                        .trim()
                        .withMessage('firstName not null & not whitespace'),
                    check('lastName')
                        .exists()
                        .withMessage('lastName is required')
                        .notEmpty()
                        .trim()
                        .withMessage('lastName not null & not whitespace'),
                    check('phone')
                        .exists()
                        .notEmpty()
                        .withMessage('Phone is required')
                        .isNumeric()
                        .withMessage('Phone is should Numeric')
                        .isLength({ min: 10, max: 12 })
                        .withMessage('Phone should have min 10 - 12 numbers length')
                        .custom(value => {
                        return userModel.findOne({ 'phone': value }).then(user => {
                            if (user) {
                                return Promise.reject('Phone is already case');
                            }
                        })
                    }),
                    check('birth')
                        .exists()
                        .notEmpty()
                        .withMessage('Birth is required'),
                ];
            }
            case "emailRevalidation": {
                return [
                    check('email')
                        .exists()
                        .withMessage('Email is required')
                        .notEmpty()
                        .trim()
                        .withMessage('Email not null & not whitespace')
                        .isEmail()
                        .withMessage('Email not valid')
                ]
            }
        }
    }
}