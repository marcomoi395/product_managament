// GET /admin/products
const Product = require("../../models/product.model");
const filterStatus = require("../../miscs/filter-status");
const objectSearch = require("../../miscs/search");

module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    // Filter status
    if (req.query.status) {
        find.status = req.query.status;
    }
    // Filter status END

    //Search
    Object.assign(find, objectSearch(req).searchCondition);
    //Search END


    const products = await Product.find(find);

    res.render("admin/pages/products/index", {
        pageTitle: "Products",
        products: products,
        filterStatus: filterStatus(req),
        title: objectSearch(req).keyword
    });
};
