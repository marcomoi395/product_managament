const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product.admin.controller");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.patch("/delete-product/:id", controller.deleteProduct);

router.get("/create", controller.createProduct);

module.exports = router;
