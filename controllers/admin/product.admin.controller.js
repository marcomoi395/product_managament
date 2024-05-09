// GET /admin/products
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    const products = await Product.find({});
    // console.log(products);

    res.render("admin/pages/products/index", {
        pageTitle: "Products",
        products: products
    });
};
