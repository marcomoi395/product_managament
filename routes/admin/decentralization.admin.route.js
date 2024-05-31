const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/decentralization.admin.controller");

router.get("/", controller.index);

router.patch("/change", controller.changePermission);

module.exports = router;
