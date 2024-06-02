module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", `Please enter title`);
        res.redirect("back");
        return;
    }

    next();
};
