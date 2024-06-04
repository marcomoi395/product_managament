const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const controller = require("../../controllers/admin/myAccount.admin.controller");
const validate = require("../../validate/admin/account.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/edit/", controller.editAccount);

router.patch(
    "/edit/",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.edit,
    controller.editAccountPatch,
);

module.exports = router;
