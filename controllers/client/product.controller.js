// GET /
const Product = require("../../models/product.model");
const Category = require("../../models/category.model");
const filterStatus = require("../../miscs/filter-status-client");
const search = require("../../miscs/search");
const getSubCategory = require("../../miscs/getSubCategory");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
    try {
        let find = {
            deleted: false,
            status: "active",
        };

        // Filter status
        if (req.query.status) {
            if (req.query.status === "featured") {
                find.featured = true; //Trường hợp dành cho featured
            } else {
                find.status = req.query.status;
            }
        }
        // Filter status END

        //Search
        Object.assign(find, search(req).searchCondition);
        //Search END

        // Sort
        let sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue === "desc" ? -1 : 1;
        } else {
            sort.position = -1; // Default sort by position in descending order
        }
        // Sort END

        const products = await Product.aggregate([
            {
                $match: find,
            },
            {
                $set: {
                    category_id: { $toObjectId: "$category_id" },
                },
            },
            { $sort: sort },
            {
                $lookup: {
                    from: "category-products",
                    localField: "category_id",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            {
                $set: {
                    categoryDetails: { $arrayElemAt: ["$categoryDetails", 0] },
                },
            },
            {
                $project: {
                    createdBy: 0, // Bao gồm _id
                    editedBy: 0, // Bao gồm trường name
                    deletedBy: 0, // Bao gồm category_id
                    restoredBy: 0, // Bao gồm thông tin về category
                },
            },
        ]).exec();

        res.render("client/pages/products/index", {
            pageTitle: "Products",
            products: products,
            filterStatus: filterStatus(req),
            title: search(req).keyword,
        });
    } catch (e) {
        res.redirect(`/`);
    }
};

module.exports.productsByCategory = async (req, res) => {
    try {
        let find = {
            deleted: false,
            status: "active",
        };

        // Filter status
        if (req.query.status) {
            if (req.query.status === "featured") {
                find.featured = true; //Trường hợp dành cho featured
            } else {
                find.status = req.query.status;
            }
        }
        // Filter status END

        //Search
        Object.assign(find, search(req).searchCondition);
        //Search END

        // Sort
        let sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue === "desc" ? -1 : 1;
        } else {
            sort.position = -1; // Default sort by position in descending order
        }
        // Sort END

        const slug = req.params.slug;

        const category = await Category.findOne({
            deleted: false,
            status: "active",
            slug: slug,
        }).select("id title");

        let categoryId = await getSubCategory(category.id, [category.id]);

        const products = await Product.find({
            category_id: { $in: categoryId },
            ...find,
        })
            .sort(sort)
            .select("-createdBy -editedBy -deletedBy -restoredBy");

        res.render("client/pages/products/category", {
            pageTitle: category.title,
            products: products,
            slugCategory: slug,
            filterStatus: filterStatus(req),
            title: search(req).keyword,
        });
    } catch (e) {
        res.redirect(`/products`);
    }
};

// GET /detail
module.exports.detailProduct = async (req, res) => {
    try {
        res.send(req.params);
        // console.log(req.params);
        // let find = {
        //     deleted: false,
        //     slug: req.params.slugProduct,
        // };
        //
        // const product = await Product.findOne(find).lean();
        //
        // const titleCategory = await categoryProduct.findOne({
        //     deleted: false,
        //     _id: product.category_id,
        // });
        //
        // if (titleCategory) {
        //     product.titleCategory = titleCategory.title;
        // }
        //
        // product.status =
        //     product.status[0].toUpperCase() + product.status.slice(1);
        //
        // res.render("admin/pages/products/detail", {
        //     product: product,
        // });
    } catch (e) {
        req.flash("error", `Error, please try again`);
        res.redirect("/admin/products");
    }
};
