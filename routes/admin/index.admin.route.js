const productRouter = require("./product.admin.route");
const dashboardRouter = require("./dashboard.admin.route");
const categoryRouter = require("./category.admin.route");
const recycleBinRouter = require("./recyclebin.admin.route");
const permissonRouter = require("./permission.admin.route");
const decentralizationRouter = require("./decentralization.admin.route");
const accountRouter = require("./account.admin.route");
const authRouter = require("./auth.admin.route");
const systemConfig = require("../../config/system");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN, dashboardRouter);

    app.use(PATH_ADMIN + "/products", productRouter);

    app.use(PATH_ADMIN + "/recycle-bin", recycleBinRouter);

    app.use(PATH_ADMIN + "/category", categoryRouter);

    app.use(PATH_ADMIN + "/permission", permissonRouter);

    app.use(PATH_ADMIN + "/decentralization", decentralizationRouter);

    app.use(PATH_ADMIN + "/account", accountRouter);

    app.use(PATH_ADMIN + "/auth", authRouter);
};
