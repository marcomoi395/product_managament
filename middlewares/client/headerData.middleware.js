const Category = require("../../models/category.model");

module.exports = async (req, res, next) => {
    // Category
    const category = await Category.find({
        deleted: false,
        status: "active",
    }).lean();

    function findChildCategory(records, id) {
        let result = [];
        for (let record of records) {
            if (record.parent_id === id) {
                record.child = findChildCategory(
                    records,
                    record._id.toString(),
                );
                result.push(record);
            }
        }
        return result;
    }

    res.locals.category = findChildCategory(category, "");
    // Category END

    next();
};
