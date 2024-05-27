module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', `Please enter product title`);
        res.redirect("back");
        return;
    }

    next();
};