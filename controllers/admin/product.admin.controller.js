// GET /admin/products
const Product = require("../../models/product.model");
const filterStatus = require("../../miscs/filter-status");
const search = require("../../miscs/search");
const pagination = require("../../miscs/pagination");


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
    let objectPagination = await pagination(req, Product, find);
    // Pagination END

    const products = await Product.find(find).sort({position: "desc"}).limit(objectPagination.numberOfProductsPerPage).skip(objectPagination.skip);


    res.render("admin/pages/products/index", {
        pageTitle: "Products",
        products: products,
        filterStatus: filterStatus(req),
        title: search(req).keyword,
        pagination: objectPagination
    });
};

// PATCH /change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    await Product.updateOne({_id: req.params.id}, {status: req.params.status});

    // Flash Messages
    req.flash('success', 'Successfully updated changes');

    res.redirect("back");
};

// PATCH /change-multi
module.exports.changeMulti = async (req, res) => {
    let statusChange = req.body.type;
    let ids = req.body.ids.split(", ");
    if (statusChange === "delete") {
        await Product.updateMany({_id: {$in: ids}}, {$set: {deleted: true}});
        await Product.updateMany({_id: {$in: ids}}, {$set: {deletedAt: new Date()}});

        // Flash Messages
        req.flash('success', `Successfully deleted ${ids.length} products`);

    } else if (statusChange === "restore") {
        await Product.updateMany({_id: {$in: ids}}, {$set: {deleted: false}});
        await Product.updateMany({_id: {$in: ids}}, {$unset: {deletedAt: ''}});

        // Flash Messages
        req.flash('success', `Successfully restored ${ids.length} products`);

    } else if (statusChange === "change-position") {
        for (const item of ids) {
            const [id, position] = item.split("-");
            await Product.updateOne({_id: id}, {position: position});
        }

        // Flash Messages
        req.flash('success', `Successfully changed the position of ${ids.length} products`);

    } else {
        await Product.updateMany({_id: {$in: ids}}, {$set: {status: statusChange}});

        // Flash Messages
        req.flash('success', `Successfully changed the status of ${ids.length} products`);
    }
    res.redirect("back");
};

// PATCH /delete-product
module.exports.deleteProduct = async (req, res) => {
    await Product.updateOne({_id: req.params.id}, {deleted: true});
    await Product.updateOne({_id: req.params.id}, {deletedAt: new Date()});

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

// POST /create
module.exports.createProductPost = async (req, res) => {
    const data = req.body;

    if (data.price)
        data.price = parseInt(data.price);

    if (data.stock)
        data.stock = parseInt(data.stock);

    if (data.position === "") {
        const countProduct = await Product.countDocuments();
        data.position = countProduct + 1;
    } else {
        data.position = parseInt(data.position);
    }

    const product = new Product(data);
    await product.save();

    // Flash Messages
    req.flash('success', `Successfully added ${data.title} to the product list`);

    res.redirect("/admin/products");
};

// GET /edit
module.exports.editProduct = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);
        res.render("admin/pages/products/edit", {
            pageTitle: "Edit product",
            product: product
        });
    } catch (error) {
        res.redirect("back");
    }
};

// PATCH /editPatch
module.exports.editProductPatch = async (req, res) => {
    const data = req.body;
    const id = req.params.id;

    if (data.price)
        data.price = parseInt(data.price);

    if (data.stock)
        data.stock = parseInt(data.stock);

    if (data.position)
        data.position = parseInt(data.position);

    console.log(data);

    try {
        await Product.updateOne({_id: id}, data);
        req.flash('success', `Successfully update the product`);
        res.redirect("back");
    } catch (error) {
        req.flash('error', `Error, please try again`);
        res.redirect("back");
    }
};