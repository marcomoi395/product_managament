const productRouter = require("./product.admin.route");
const dashboardRouter = require("./dashboard.admin.route");
const recycleBinRouter = require("./recyclebin.admin.route");
const systemConfig = require("../../config/system");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN, dashboardRouter);

    app.use(PATH_ADMIN + "/products", productRouter);

    app.use(PATH_ADMIN + "/recycle-bin", recycleBinRouter);
};
