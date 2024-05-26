// GET /
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
    let find = {
        deleted: "false",
        status: "active"
    };
    const products = await Product.find(find).sort({position: "desc"});

    res.render("client/pages/products/index", {
        pageTitle: "Products",
        products: products
    });
};
