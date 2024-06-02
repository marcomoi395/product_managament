const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const controller = require("../../controllers/admin/category.admin.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const validate = require("../../validate/admin/category.validate");

router.get("/", controller.index);

router.get("/create", controller.createCategoryProduct);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createCategoryProductPost,
);

router.patch("/change-multi", controller.changeMulti);

router.patch("/delete-category/:id", controller.deleteCategoryProduct);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/edit/:id", controller.editCategoryProduct);

router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.editCategoryProductPatch,
);

router.get("/detail/:slug", controller.detailCategoryProduct);

module.exports = router;
