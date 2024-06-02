// GET /admin/products
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const mongoose = require("mongoose");
const md5 = require("md5");
const filterStatus = require("../../miscs/filter-status");
const generateRandomToken = require("../../miscs/generateRandomToken");
const systemConfig = require("../../config/system");

// GET /login
module.exports.login = async (req, res) => {
    res.render("admin/pages/auth/login", {
        pageTitle: "Login",
    });
};

// POST /login
module.exports.loginPost = async (req, res) => {
    const data = req.body;
    const email = data.email;
    const password = data.password;

    const user = await Account.findOne({
        deleted: false,
        email: email,
    });

    if (!user) {
        req.flash("error", "Email does not exist");
        res.redirect("back");
        return;
    }

    if (md5(password) !== user.password) {
        req.flash("error", "Password is not correct");
        res.redirect("back");
        return;
    }

    if (user.status === "inactive") {
        req.flash("error", "Account has been locked");
        res.redirect("back");
        return;
    }

    res.cookie("token", user.token);
    req.flash("success", "Login successfully");
    res.redirect(`${systemConfig.prefixAdmin}`);
};
