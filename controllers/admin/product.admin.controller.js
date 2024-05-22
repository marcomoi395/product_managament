// GET /admin/products
const Product = require("../../models/product.model");
const filterStatus = require("../../miscs/filter-status");
const search = require("../../miscs/search");
const pagination = require("../../miscs/pagination");

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
    Object.assign(find, search(req).searchCondition);
    //Search END

    // Pagination
    let objectPagination = await pagination(req, Product, find);
    // Pagination END

    const products = await Product.find(find).limit(objectPagination.numberOfProductsPerPage).skip(objectPagination.skip);

    res.render("admin/pages/products/index", {
        pageTitle: "Products",
        products: products,
        filterStatus: filterStatus(req),
        title: search(req).keyword,
        pagination: objectPagination
    });
};

module.exports.changeStatus = async (req, res) => {
    await Product.updateOne({_id: req.params.id}, {status: req.params.status});

    res.redirect("back");
};