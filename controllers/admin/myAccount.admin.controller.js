// GET /admin/products
const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const filterStatus = require("../../miscs/filter-status");
const search = require("../../miscs/search");
const pagination = require("../../miscs/pagination");

// GET /detail
module.exports.index = async (req, res) => {
    const role = await Role.findOne({
        deleted: false,
        _id: res.locals.user.role_id,
    });

    res.render("admin/pages/my-account/index", {
        roleTitle: role.title,
    });
};

// GET /edit
module.exports.editAccount = async (req, res) => {
    try {
        res.render("admin/pages/my-account/edit", {
            pageTitle: "Edit Account",
        });
    } catch (error) {
        res.redirect("back");
    }
};

// PATCH /edit
module.exports.editAccountPatch = async (req, res) => {
    const data = req.body;

    const emailExist = await Account.findOne({
        deleted: false,
        email: data.email,
        _id: { $ne: res.locals.user.id },
    });

    if (emailExist) {
        console.log("OK");
        req.flash("error", `Email already exists`);
        res.redirect("back");
        return;
    }

    if (data.password) {
        data.password = md5(data.password);
    } else {
        delete data.password;
    }

    await Account.updateOne({ _id: res.locals.user.id }, data);
    try {
        req.flash("success", `Successfully update account`);
    } catch (error) {
        req.flash("error", `Error, please try again`);
    }
    res.redirect("back");
};
