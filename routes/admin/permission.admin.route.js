const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/permission.admin.controller");
const validate = require("../../validate/admin/permission.validate");

router.get("/", controller.index);

router.get("/create", controller.createPermission);

router.post("/create", validate.createPost, controller.createPermissionPost);

router.patch("/delete-permission/:id", controller.deletePermission);

router.get("/edit/:id", controller.editPermission);

router.patch("/edit/:id", validate.createPost, controller.editPermissionPatch);

module.exports = router;
