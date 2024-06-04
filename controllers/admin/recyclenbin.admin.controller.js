// GET /admin/recycle-bin
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const filterStatus = require("../../miscs/filter-status");
const search = require("../../miscs/search");
const pagination = require("../../miscs/pagination");

// GET /
module.exports.index = async (req, res) => {
    let find = {
        deleted: true,
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

    // Sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    // Sort END

    const products = await Product.find(find)
        .sort(sort)
        .limit(objectPagination.numberOfProductsPerPage)
        .skip(objectPagination.skip);

    res.render("admin/pages/recycle_bin/index", {
        pageTitle: "Recycle Bin",
        products: products,
        filterStatus: filterStatus(req),
        title: search(req).keyword,
        pagination: objectPagination,
    });
};

// PATCH /restore-product
module.exports.restoreProduct = async (req, res) => {
    const restoredBy = {
        fullName: res.locals.user.fullName,
        id: res.locals.user.id,
        restoredAt: Date.now(),
    };

    const data = req.body;
    data.deleted = false;

    await Product.updateOne(
        { _id: req.params.id },
        {
            ...data,
            $push: {
                restoredBy: restoredBy,
            },
        },
    );

    res.redirect("back");
};
