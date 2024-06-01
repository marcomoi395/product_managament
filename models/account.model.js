const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        token: String,
        thumbnail: String,
        role_id: String,
        status: String,
        phone: String,
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: Date,
    },
    {
        timestamps: true,
    },
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;
