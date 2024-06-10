const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        thumbnail: String,
        phone: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedBy: [
            {
                fullName: String,
                id: String,
                deletedAt: Date,
            },
        ],
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model("User", userSchema, "user");

module.exports = User;
