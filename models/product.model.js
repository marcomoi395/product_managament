const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
    {
        title: String,
        author: String,
        description: String,
        price: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        position: Number,
        slug: { type: String, slug: "title", unique: true },
        deleted: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            fullName: String,
            id: String,
            createdAt: {
                type: Date,
                default: Date.now(),
            },
        },
        deletedBy: [
            {
                fullName: String,
                id: String,
                deletedAt: Date,
            },
        ],
        restoredBy: [
            {
                fullName: String,
                id: String,
                restoredAt: Date,
            },
        ],
        editedBy: [
            {
                fullName: String,
                id: String,
                editedAt: Date,
            },
        ],
    },
    {
        timestamps: true,
    },
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
