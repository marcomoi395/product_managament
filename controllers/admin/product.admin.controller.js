// GET /admin/products
const Product = require("../../models/product.model");
const filterStatus = require("../../miscs/filter-status");
const search = require("../../miscs/search");
const pagination = require("../../miscs/pagination");

// GET /
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
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

    res.render("admin/pages/products/index", {
        pageTitle: "List of products",
        products: products,
        filterStatus: filterStatus(req),
        title: search(req).keyword,
        pagination: objectPagination,
    });
};

// PATCH /change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const data = req.body;
    data.status = req.params.status;
    const editedBy = {
        fullName: res.locals.user.fullName,
        id: res.locals.user.id,
        editedAt: Date.now(),
    };

    await Product.updateOne(
        { _id: req.params.id },
        {
            ...data,
            $push: { editedBy: editedBy },
        },
    );

    // Flash Messages
    req.flash("success", "Successfully updated changes");

    res.redirect("back");
};

// PATCH /change-multi
module.exports.changeMulti = async (req, res) => {
    const data = req.body;
    let statusChange = data.type;
    let ids = data.ids.split(", ");

    const editedBy = {
        fullName: res.locals.user.fullName,
        id: res.locals.user.id,
        editedAt: Date.now(),
    };

    const deletedBy = {
        fullName: res.locals.user.fullName,
        id: res.locals.user.id,
        deletedAt: Date.now(),
    };

    const restoredBy = {
        fullName: res.locals.user.fullName,
        id: res.locals.user.id,
        restoredAt: Date.now(),
    };

    if (statusChange === "delete") {
        await Product.updateMany(
            { _id: { $in: ids } },
            {
                $set: { deleted: true },
                $push: {
                    deletedBy: deletedBy,
                },
            },
        );

        // Flash Messages
        req.flash("success", `Successfully deleted ${ids.length} products`);
    } else if (statusChange === "restore") {
        await Product.updateMany(
            { _id: { $in: ids } },
            {
                $set: { deleted: false },
                $push: {
                    restoredBy: restoredBy,
                },
            },
        );

        // Flash Messages
        req.flash("success", `Successfully restored ${ids.length} products`);
    } else if (statusChange === "change-position") {
        for (const item of ids) {
            const [id, position] = item.split("-");
            await Product.updateOne(
                { _id: id },
                {
                    position: position,
                    $push: {
                        editedBy: editedBy,
                    },
                },
            );
        }

        // Flash Messages
        req.flash(
            "success",
            `Successfully changed the position of ${ids.length} products`,
        );
    } else {
        await Product.updateMany(
            { _id: { $in: ids } },
            {
                $set: {
                    status: statusChange,
                },
                $push: {
                    editedBy: editedBy,
                },
            },
        );

        // Flash Messages
        req.flash(
            "success",
            `Successfully changed the status of ${ids.length} products`,
        );
    }
    res.redirect("back");
};

// PATCH /delete-product
module.exports.deleteProduct = async (req, res) => {
    const data = req.body;
    data.deleted = true;

    const deletedBy = {
        fullName: res.locals.user.fullName,
        id: res.locals.user.id,
        deletedAt: Date.now(),
    };

    await Product.updateOne(
        { _id: req.params.id },
        {
            ...data,
            $push: { deletedBy: deletedBy },
        },
    );

    // Flash Messages
    req.flash("success", `Successfully deleted product`);

    res.redirect("back");
};

// GET /create
module.exports.createProduct = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Add new product",
    });
};

// POST /create
module.exports.createProductPost = async (req, res) => {
    const data = req.body;

    if (data.price) data.price = parseInt(data.price);

    if (data.stock) data.stock = parseInt(data.stock);

    if (data.position === "") {
        const countProduct = await Product.find({
            deleted: false,
        }).countDocuments();
        data.position = countProduct + 1;
    } else {
        data.position = parseInt(data.position);
    }

    data.createdBy = {
        fullName: res.locals.user.fullName,
        id: res.locals.user.id,
        createdAt: Date.now(),
    };

    const product = new Product(data);
    await product.save();

    // Flash Messages
    req.flash(
        "success",
        `Successfully added ${data.title} to the product list`,
    );

    res.redirect("/admin/products");
};

// GET /edit
module.exports.editProduct = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };

        const product = await Product.findOne(find);
        res.render("admin/pages/products/edit", {
            pageTitle: "Edit product",
            product: product,
        });
    } catch (error) {
        res.redirect("back");
    }
};

// PATCH /edit
module.exports.editProductPatch = async (req, res) => {
    const data = req.body;
    const id = req.params.id;

    const editedBy = {
        fullName: res.locals.user.fullName,
        id: res.locals.user.id,
        editedAt: Date.now(),
    };

    if (data.price) data.price = parseInt(data.price);

    if (data.stock) data.stock = parseInt(data.stock);

    if (data.position) data.position = parseInt(data.position);

    try {
        await Product.updateOne(
            { _id: id },
            {
                ...data,
                $push: {
                    editedBy: editedBy,
                },
            },
        );
        req.flash("success", `Successfully update the product`);
        res.redirect("back");
    } catch (error) {
        req.flash("error", `Error, please try again`);
        res.redirect("back");
    }
};

// GET /detail
module.exports.detailProduct = async (req, res) => {
    let find = {
        deleted: false,
        slug: req.params.slug,
    };

    const product = await Product.findOne(find);
    product.status = product.status[0].toUpperCase() + product.status.slice(1);

    res.render("admin/pages/products/detail", {
        product: product,
    });
};
