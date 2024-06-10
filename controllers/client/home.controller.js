const Category = require("../../models/category.model");
const Product = require("../../models/product.model");
const sortNameByClass = require("../../miscs/sortNameByClass");

// GET /products
module.exports.index = async (req, res) => {
    // Product
    // const products = await Product.find({
    //     deleted: false,
    //     featured: true,
    // });
    // Product End

    const find = {
        deleted: false,
        featured: true,
    };

    let sort = { position: -1 };

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

    res.render("client/pages/home/index", {
        pageTitle: "Homepage",
        products: products,
    });
};
