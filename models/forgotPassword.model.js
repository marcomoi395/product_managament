const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const tokenForgotPassword = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "user",
        },
        token: {
            type: String,
            required: true,
        },
        expireAfterSeconds: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

const ForgotPassword = mongoose.model(
    "ForgotPassword",
    tokenForgotPassword,
    "forgot-password",
);

module.exports = ForgotPassword;
