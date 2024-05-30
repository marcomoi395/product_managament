const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const categoryProductSchema = new mongoose.Schema({
        title: String,
        parent_id: {
            type: String,
            default: ""
        },
        description: String,
        status: String,
        position: Number,
        thumbnail: String,
        slug: {type: String, slug: "title", unique: true},
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    });

const categoryProduct = mongoose.model("categoryProduct", categoryProductSchema, "category-products");

module.exports = categoryProduct;
