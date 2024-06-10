const productRouter = require("./product.route");
const homeRouter = require("./home.route");
const userRouter = require("./user.route");
const headerDataMiddleware = require("../../middlewares/client/headerData.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");

module.exports = (app) => {
    app.use(authMiddleware.auth);

    app.use(headerDataMiddleware);

    app.use("/", homeRouter);

    app.use("/products", productRouter);

    app.use("/user", userRouter);
};
