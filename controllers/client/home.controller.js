const Category = require("../../models/category.model");
const Product = require("../../models/product.model");
const sortNameByClass = require("../../miscs/sortNameByClass");

// GET /products
module.exports.index = async (req, res) => {
    // Product
    const products = await Product.find({
        deleted: false,
        featured: true,
    });
    // Product End

    res.render("client/pages/home/index", {
        pageTitle: "Homepage",
        products: products,
    });
};
