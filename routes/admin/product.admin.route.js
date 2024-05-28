const express = require("express");
const multer = require('multer');
const upload = multer();
const router = express.Router();
const controller = require("../../controllers/admin/product.admin.controller");
const validate = require("../../validate/admin/product.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");


router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.patch("/delete-product/:id", controller.deleteProduct);

router.get("/create", controller.createProduct);

router.post(
    "/create",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createProductPost
);

router.get("/edit/:id", controller.editProduct);

router.patch("/edit/:id",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.editProductPatch
);

module.exports = router;
