const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/auth.admin.controller");
const validate = require("../../validate/admin/auth.validate");

router.get("/login", controller.login);

router.post("/login", validate.login, controller.loginPost);

module.exports = router;
