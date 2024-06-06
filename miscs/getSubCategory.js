const Category = require("../models/category.model");

async function getSubCategory(id, categoryIds) {
    const subcategories = await Category.find({
        deleted: false,
        parent_id: id,
    }).select("_id"); // Chỉ chọn _id

    if (subcategories.length > 0) {
        for (const category of subcategories) {
            categoryIds.push(category._id); // Thêm _id của danh mục vào mảng
            await getSubCategory(category._id, categoryIds); // Đệ quy để lấy danh mục con
        }
    }

    return categoryIds;
}

module.exports = getSubCategory;
