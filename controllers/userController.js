const { userModel, secretCodeModel } = require('../models/userModel');
const { validationResult, check } = require("express-validator");
const bcrypt = require('bcryptjs');
const { generateNumber } = require('../utils/generateString');
const { sendMailActivation, sendMailCodeResetPassword } = require('../utils/sendMail');
const jwt = require('jsonwebtoken');

module.exports = {
    removeAllAccounts: async (req, res, next) => {
        try {
            await userModel.remove();

            return res.status(200).json({ message: 'Remove all account was successfully' });
        } catch (error) {
            return res.status(400).json({ message: err.message });
        }
    },
    getDetailUser: async (req, res, next) => {
        try {
            const { userId } = req.params;

            const user = await userModel.findOne({ _id: userId });

            if (!user) return res.status(404).json({ message: "User not found" });

            return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({ message: err.message });
        }
    },
    editProfile: async (req, res, next) => {
        try {
            const { name, phone } = req.body;
            const { userId } = req.params;

            await userModel.updateOne({ _id: userId }, { name, phone });
            return res.status(200).json({ message: "Update profile was successfully" });
        } catch (error) {
            return res.status(400).json({ message: err.message });
        }
    },
    signUp: async (req, res, next) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() });
                return;
            }
            const { email, name, password, phone } = req.body;

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);

            const user = await userModel.create({
                email: email.toLowerCase(),
                name,
                password: hashPassword,
                phone
            })


            const resJson = { message: "Successfully", data: { userId: user._id }}

            return res.status(201).json(resJson);
        }catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    changeStatusAccount: async (req, res, next) => {
        try {
            const { secretCode } = req.body;

            const code = await secretCodeModel.findOne({ code: secretCode });

            if (code) {
                const user = await userModel.findOne({ email: code.email });

                if (user.status !== "pending") {
                    return res.status(422).json({ message: "User already actived" });
                }
                
                user.status = "active";
                user.save();

                return res.status(200).json({ message: "Successfully", data: { id: user.id, status: user.status } });
            }
            
            return res.status(404).json({ message: 'Token expired' });
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    sendTokenActivationAccount: async (req, res, next) => {
        try {
            const { email } = req.body;

            const user = await userModel.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'E-mail not registered' })
            }

            if (user.status === "active") {
                return res.json({ message: "Account is already actived" })
            }

            const code = generateNumber(5);
            const secretCode = await secretCodeModel.create({
                email,
                code,
            });

            sendMailActivation(user.email, secretCode.code);

            return res.status(200).json({ secretCode });
        } catch (error) {
            return res.status(400).json({ message: err.message });
        }
    },
    signIn: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const user = await userModel.findOne({ email });

            if (user && (await bcrypt.compare(password, user.password))) {
                const token = jwt.sign({
                    user_id: user._id,
                    email,
                }, process.env.TOKEN_SECRET, { expiresIn: "2h" })

                return res.status(200).json({ user, token, message: "Login successfully" });
            }

            return res.status(400).send("Email or Password was is wrong");
        } catch (error) {
            return res.status(400).json({ message: err.message });
        }
    },
    sendCodeResetPassword: async (req, res, next) => {
        try {
            const { email } = req.body;

            const user = await userModel.findOne({ email });

            if (!user) return res.status(404).send("Email not registered");

            const tokenResetPassword = generateNumber(5);

            const secretCode = await secretCodeModel.create({
                email: user.email,
                code: tokenResetPassword,
            });
            sendMailCodeResetPassword(user.email, tokenResetPassword);

            return res.status(200).json({ message: 'Send Token reset Successfully', data: { secretCode: secretCode.code } });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    },
    checkSecretCodeforResetPassword: async (req, res, next) => {
        const { secretCode } = req.body;

            const code = await secretCodeModel.findOne({ code: secretCode });

            if (code) {
                const user = await userModel.findOne({ email: code.email });

                return res.status(200).json({ message: "Successfully", data: { email: user.email }});
            }
            
            return res.status(404).json({ message: 'Token expired' });
    },
    changePasswordAccount: async (req, res, next) => {
        try {
            const { email, newPassword } = req.body;

            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(newPassword, salt);

            const user = await userModel.findOneAndUpdate({ email }, { password: hashPassword });

            return res.status(200).json({ message: "Changed password is successfully" });
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
                    check('name')
                        .exists()
                        .withMessage('name is required')
                        .notEmpty()
                        .trim()
                        .withMessage('name not null & not whitespace'),
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
                        });
                    }),

                ];
            }
            case "editProfile": {
                return [
                    check('name')
                        .exists()
                        .withMessage('name is required')
                        .notEmpty()
                        .trim()
                        .withMessage('name not null & not whitespace'),
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
                        });
                    }),

                ];
            }
            case "sendTokenActivationAccount": {
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
            case "signIn": {
                return [
                    check('email')
                        .exists()
                        .withMessage('Email is required')
                        .notEmpty()
                        .trim()
                        .withMessage('Email not null & not whitespace')
                        .isEmail()
                        .withMessage('Email not valid'),
                    check('password')
                        .exists()
                        .withMessage('Password is required')
                        .notEmpty()
                        .trim()
                        .withMessage('Email not null & not whitespace')
                ];
            }
            case "resetPassword": {
                return [
                    check('email')
                        .exists()
                        .withMessage('Email is required')
                        .notEmpty()
                        .trim()
                        .withMessage('Email not null & not whitespace')
                        .isEmail()
                        .withMessage('Email not valid'),
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
                ]
            }
        }
    }
}