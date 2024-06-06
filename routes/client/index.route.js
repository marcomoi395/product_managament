const productRouter = require("./product.route");
const homeRouter = require("./home.route");
const headerDataMiddleware = require("../../middlewares/client/headerData.middleware");

module.exports = (app) => {
    app.use(headerDataMiddleware);

    app.use("/", homeRouter);

    app.use("/products", productRouter);
};
