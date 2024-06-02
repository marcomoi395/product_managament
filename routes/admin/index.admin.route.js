const productRouter = require("./product.admin.route");
const dashboardRouter = require("./dashboard.admin.route");
const categoryRouter = require("./category.admin.route");
const recycleBinRouter = require("./recyclebin.admin.route");
const permissonRouter = require("./permission.admin.route");
const decentralizationRouter = require("./decentralization.admin.route");
const accountRouter = require("./account.admin.route");
const authRouter = require("./auth.admin.route");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const systemConfig = require("../../config/system");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.get(PATH_ADMIN, (req, res) => {
        res.redirect(PATH_ADMIN + "/dashboard");
    });

    app.use(PATH_ADMIN + "/dashboard", authMiddleware.auth, dashboardRouter);

    app.use(PATH_ADMIN + "/products", authMiddleware.auth, productRouter);

    app.use(PATH_ADMIN + "/recycle-bin", authMiddleware.auth, recycleBinRouter);

    app.use(PATH_ADMIN + "/category", authMiddleware.auth, categoryRouter);

    app.use(PATH_ADMIN + "/permission", authMiddleware.auth, permissonRouter);

    app.use(
        PATH_ADMIN + "/decentralization",
        authMiddleware.auth,
        decentralizationRouter,
    );

    app.use(PATH_ADMIN + "/account", authMiddleware.auth, accountRouter);

    app.use(PATH_ADMIN + "/auth", authRouter);
};
