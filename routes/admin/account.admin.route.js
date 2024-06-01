const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const controller = require("../../controllers/admin/account.admin.controller");
const validate = require("../../validate/admin/account.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/create", controller.createAccount);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.create,
    controller.createAccountPost,
);

router.patch("/delete-account/:id", controller.deleteAccount);

router.get("/edit/:id", controller.editAccount);

router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.edit,
    controller.editAccountPatch,
);

router.patch("/change-status/:status/:id", controller.changeStatusAccount);

module.exports = router;
