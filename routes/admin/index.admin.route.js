const productRouter = require("./product.admin.route");
const dashboardRouter = require("./dashboard.admin.route");

module.exports = (app) => {
    app.use("/admin/", dashboardRouter);

    app.use("/admin/products", productRouter);
};
