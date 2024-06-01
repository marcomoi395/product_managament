// GET /admin/products
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const mongoose = require("mongoose");
const md5 = require("md5");
const filterStatus = require("../../miscs/filter-status");
const generateRandomToken = require("../../miscs/generateRandomToken");

// GET /
module.exports.index = async (req, res) => {
    let find = { deleted: false };

    // Filter status
    if (req.query.status) {
        find.status = req.query.status;
    }
    // Filter status END

    const records = await Account.find(find).select("-password -token").lean();
    for (const record of records) {
        const role = await Role.findOne({
            deleted: false,
            _id: record.role_id,
        });
        record.role = role.title;
    }

    res.render("admin/pages/account/index", {
        pageTitle: "Account List",
        records: records,
        filterStatus: filterStatus(req),
    });
};

// GET /create
module.exports.createAccount = async (req, res) => {
    const roles = await Role.find({
        deleted: false,
    });

    res.render("admin/pages/account/create", {
        pageTitle: "Add new account",
        roles: roles,
    });
};

// POST /create
module.exports.createAccountPost = async (req, res) => {
    const data = req.body;

    const emailExist = await Account.findOne({
        deleted: false,
        email: data.email,
    });

    if (emailExist) {
        console.log("OK");
        req.flash("error", `Email already exists`);
        res.redirect("back");
        return;
    }

    data.password = md5(data.password);
    data.token = generateRandomToken(20);

    try {
        const newAccount = new Account(req.body);
        await newAccount.save();
        req.flash("success", `Successfully create account`);
    } catch (error) {
        req.flash("error", `Error`);
    }
    res.redirect("/admin/account");
};

// GET /edit
module.exports.editAccount = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };

        const record = await Account.findOne(find).select("-token -password");
        const roles = await Role.find({ deleted: false });

        res.render("admin/pages/account/edit", {
            pageTitle: "Edit Account",
            record: record,
            roles: roles,
        });
    } catch (error) {
        res.redirect("back");
    }
};

// PATCH /edit
module.exports.editAccountPatch = async (req, res) => {
    const data = req.body;
    const id = req.params.id;

    const emailExist = await Account.findOne({
        deleted: false,
        email: data.email,
        _id: { $ne: id },
    });

    console.log(emailExist);

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

    await Account.updateOne({ _id: id }, data);
    try {
        req.flash("success", `Successfully update account`);
    } catch (error) {
        req.flash("error", `Error, please try again`);
    }
    res.redirect("back");
};

// PATCH /delete-product
module.exports.deleteAccount = async (req, res) => {
    await Account.updateOne({ _id: req.params.id }, { deleted: true });
    await Account.updateOne({ _id: req.params.id }, { deletedAt: new Date() });

    // Flash Messages
    req.flash("success", `Successfully deleted account`);

    res.redirect("back");
};

// PATCH /change-status/:status/:id
module.exports.changeStatusAccount = async (req, res) => {
    await Account.updateOne(
        { _id: req.params.id },
        { status: req.params.status },
    );

    // Flash Messages
    req.flash("success", "Successfully updated changes");

    res.redirect("back");
};
