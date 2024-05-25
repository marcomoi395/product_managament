const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/recyclenbin.admin.controller");

router.get("/", controller.index);

router.patch("/restore-product/:id", controller.restoreProduct);

module.exports = router;
