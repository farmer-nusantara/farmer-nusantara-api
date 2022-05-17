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
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'pending'],
        default: "pending",
    }
});

const secretCode = new Schema({
    email: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now(),
        expires: '5m',
    },
});

const userModel = mongoose.model("Users", userSchema);
const secretCodeModel = mongoose.model("SecretCodes", secretCode);

module.exports = { userModel, secretCodeModel };
