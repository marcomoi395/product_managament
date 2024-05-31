// GET /
module.exports.index = (req, res) => {
    res.render("admin/pages/decentralization/index", {
        pageTitle: "Decentralization"
    });
};
