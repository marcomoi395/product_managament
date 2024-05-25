// GET /admin/recycle-bin
const Product = require("../../models/product.model");
const filterStatus = require("../../miscs/filter-status");
const search = require("../../miscs/search");
const pagination = require("../../miscs/pagination");

// GET /
module.exports.index = async (req, res) => {
    let find = {
        deleted: true
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

    const products = await Product.find(find).sort({position: "desc"}).limit(objectPagination.numberOfProductsPerPage).skip(objectPagination.skip);

    res.render("admin/pages/recycle_bin/index", {
        pageTitle: "Recycle Bin",
        products: products,
        filterStatus: filterStatus(req),
        title: search(req).keyword,
        pagination: objectPagination
    });
};


// PATCH /restore-product
module.exports.restoreProduct = async (req, res) => {
    await Product.updateOne({_id: req.params.id}, {deleted: false});
    await Product.updateOne({_id: req.params.id}, {$unset: {deletedAt: ''}});

    res.redirect("back");
};
