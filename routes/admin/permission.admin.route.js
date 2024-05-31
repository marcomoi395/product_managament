const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/permission.admin.controller");


router.get("/", controller.index);

router.get("/create", controller.createPermission);

router.post("/create", controller.createPermissionPost);

router.patch("/delete-permission/:id", controller.deletePermission);

router.get("/edit/:id", controller.editPermission);

router.patch("/edit/:id", controller.editPermissionPatch);


module.exports = router;
