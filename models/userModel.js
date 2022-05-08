const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        default: null,
    },
    phone: {
        type: String,
        required: true,
    },
    birth: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'pending'],
        default: "pending",
    }
}, { timestamps: true });

const secretCode = new Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires: 600,
    },
});

const userModel = mongoose.model("Users", userSchema);
const secretCodeModel = mongoose.model("SecretCodes", secretCode);

module.exports = { userModel, secretCodeModel };
