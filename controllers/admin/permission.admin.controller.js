const Permission = require("../../models/role.model");

// GET /
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    try {
        const records = await Permission.find(find);

        res.render("admin/pages/permission/index", {
            pageTitle: "Permission",
            records: records
        });
    } catch {
        // Flash Messages
        req.flash('error', `Error. Please try again`);
        res.redirect("/admin");
    }

};

// GET /create
module.exports.createPermission = async (req, res) => {
    res.render("admin/pages/permission/create", {
        pageTitle: "Add new permission",
    });
};

// POST /create
module.exports.createPermissionPost = async (req, res) => {
    const data = req.body;

    try {
        const record = new Permission(data);
        await record.save();

        // Flash Messages
        req.flash('success', `Successfully added ${data.title} to the permission group`);

        res.redirect("/admin/permission");
    } catch (error) {
        // Flash Messages
        req.flash('error', `Error. Please try again`);
        res.redirect("/admin/permission");
    }
};

// PATCH /delete
module.exports.deletePermission = async (req, res) => {
    const data = req.params;

    try {
        await Permission.updateOne({_id: req.params.id}, {deleted: true});
        await Permission.updateOne({_id: req.params.id}, {deletedAt: new Date()});

        // Flash Messages
        req.flash('success', `Successfully deleted permission`);
        res.redirect("/admin/permission");
    } catch (error) {
        // Flash Messages
        req.flash('error', `Error. Please try again`);
        res.redirect("/admin/permission");
    }
};

// GET /edit
module.exports.editPermission = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const record = await Permission.findOne(find);
        res.render("admin/pages/permission/edit", {
            pageTitle: "Edit permission",
            record: record
        });
    } catch (error) {
        res.redirect("back");
    }
};

// PATCH /editPatch
module.exports.editPermissionPatch = async (req, res) => {
    const data = req.body;
    const id = req.params.id;

    try {
        await Permission.updateOne({_id: id}, data);
        req.flash('success', `Successfully update the product`);
        res.redirect("back");
    } catch (error) {
        req.flash('error', `Error, please try again`);
        res.redirect("back");
    }
};