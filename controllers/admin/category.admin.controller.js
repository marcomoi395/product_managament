// GET /admin/products
const categoryProduct = require("../../models/category.model");
const filterStatus = require("../../miscs/filter-status");
const search = require("../../miscs/search");
const pagination = require("../../miscs/pagination");
const sortNameByClass = require("../../miscs/sortNameByClass");


// GET /
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
    let objectPagination = await pagination(req, categoryProduct, find);
    // Pagination END

    // Sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.title = "asc";
    }
    // Sort END

    const records = await categoryProduct.find(find).sort(sort).limit(objectPagination.numberOfProductsPerPage).skip(objectPagination.skip);

    // sortNameByClass
    let newRecords = sortNameByClass(records);
    // sortNameByClass END

    res.render("admin/pages/category/index", {
        pageTitle: "Category",
        records: newRecords,
        filterStatus: filterStatus(req),
        titleSearch: search(req).keyword,
        pagination: objectPagination
    });
};

// GET /create
module.exports.createCategoryProduct = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await categoryProduct.find(find);

    // sortNameByClass
    let newRecords = sortNameByClass(records);
    // sortNameByClass END

    res.render("admin/pages/category/create", {
        pageTitle: "Add new product category",
        records: newRecords
    });
};

// POST /create
module.exports.createCategoryProductPost = async (req, res) => {
    const data = req.body;

    if (data.position === "") {
        const countProduct = await categoryProduct.countDocuments();
        data.position = countProduct + 1;
    } else {
        data.position = parseInt(data.position);
    }

    const record = new categoryProduct(data);
    await record.save();

    // Flash Messages
    req.flash('success', `Successfully added ${data.title} to the product portfolio`);

    res.redirect("/admin/category");
};

// PATCH /change-multi
module.exports.changeMulti = async (req, res) => {
    let statusChange = req.body.type;
    let ids = req.body.ids.split(", ");
    if (statusChange === "delete") {
        await categoryProduct.updateMany({_id: {$in: ids}}, {$set: {deleted: true}});
        await categoryProduct.updateMany({_id: {$in: ids}}, {$set: {deletedAt: new Date()}});

        // Flash Messages
        req.flash('success', `Successfully deleted ${ids.length} products`);

    } else if (statusChange === "change-position") {
        for (const item of ids) {
            const [id, position] = item.split("-");
            await categoryProduct.updateOne({_id: id}, {position: position});
        }

        // Flash Messages
        req.flash('success', `Successfully changed the position of ${ids.length} products`);

    } else {
        await categoryProduct.updateMany({_id: {$in: ids}}, {$set: {status: statusChange}});

        // Flash Messages
        req.flash('success', `Successfully changed the status of ${ids.length} products`);
    }
    res.redirect("back");
};

// PATCH /delete-category
module.exports.deleteCategoryProduct = async (req, res) => {
    await categoryProduct.updateOne({_id: req.params.id}, {deleted: true});
    await categoryProduct.updateOne({_id: req.params.id}, {deletedAt: new Date()});

    // Flash Messages
    req.flash('success', `Successfully deleted product`);

    res.redirect("back");
};

// GET /create
module.exports.createProduct = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Add new product"
    });
};

// PATCH /change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    await categoryProduct.updateOne({_id: req.params.id}, {status: req.params.status});

    // Flash Messages
    req.flash('success', 'Successfully updated changes');

    res.redirect("back");
};

// GET /edit
module.exports.editCategoryProduct = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const record = await categoryProduct.findOne(find);
        res.render("admin/pages/category/edit", {
            pageTitle: "Edit category",
            product: record
        });
    } catch (error) {
        res.redirect("back");
    }
};

// PATCH /editPatch
module.exports.editCategoryProductPatch = async (req, res) => {
    const data = req.body;
    const id = req.params.id;

    if (data.position)
        data.position = parseInt(data.position);


    try {
        await categoryProduct.updateOne({_id: id}, data);
        req.flash('success', `Successfully update the product`);
        res.redirect("back");
    } catch (error) {
        req.flash('error', `Error, please try again`);
        res.redirect("back");
    }
};

// GET /detail
module.exports.detailCategoryProduct = async (req, res) => {
    let find = {
        deleted: false,
        slug: req.params.slug
    };

    const product = await categoryProduct.findOne(find);
    product.status = product.status[0].toUpperCase() + product.status.slice(1);

    res.render("admin/pages/category/detail", {
        product: product
    });
};


