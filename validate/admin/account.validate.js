module.exports.create = (req, res, next) => {
    const data = req.body;
    if (!data.fullName) {
        req.flash("error", `Please enter full name`);
        res.redirect("back");
        return;
    }

    if (!data.email) {
        req.flash("error", `Please enter email`);
        res.redirect("back");
        return;
    }

    if (!data.password) {
        req.flash("error", `Please enter password`);
        res.redirect("back");
        return;
    }

    if (data.password.length < 6) {
        req.flash(
            "error",
            `Please enter a password with more than 6 characters`,
        );
        res.redirect("back");
        return;
    }

    next();
};

module.exports.edit = (req, res, next) => {
    const data = req.body;
    if (!data.fullName) {
        req.flash("error", `Please enter full name`);
        res.redirect("back");
        return;
    }

    if (!data.email) {
        req.flash("error", `Please enter email`);
        res.redirect("back");
        return;
    }
    next();
};
