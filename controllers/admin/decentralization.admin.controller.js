const Role = require("../../models/role.model");
const features = require("../../miscs/feature-list");

// GET /
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await Role.find(find);

    res.render("admin/pages/decentralization/index", {
        pageTitle: "Decentralization",
        records: records, features: features()
    });
};


// PATCH /change
module.exports.changePermission = async (req, res) => {
    const data = JSON.parse(req.body.permission);

    try {
        for (const item of data) {
            await Role.updateOne({_id: item.id}, {permission: item.permission});
        }
        req.flash('success', `Successfully update decentralization`);
        res.redirect("back");
    } catch (error) {
        req.flash('error', `Error, please try again`);
        res.redirect("back");
    }
};
