const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product.admin.controller");

router.get("/", controller.index);

module.exports = router;
