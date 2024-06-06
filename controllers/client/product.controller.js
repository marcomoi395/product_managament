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

        const products = await Product.find(find).sort(sort);

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
            filterStatus: filterStatus(req),
            title: search(req).keyword,
        });
    } catch (e) {
        res.redirect(`/products`);
    }
};
