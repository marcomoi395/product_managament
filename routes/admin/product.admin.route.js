const express = require("express");
const multer = require('multer');
const storageMulter = require('../../miscs/storageMulter');
const upload = multer({storage: storageMulter()});
const router = express.Router();
const controller = require("../../controllers/admin/product.admin.controller");
const validate = require("../../validate/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.patch("/delete-product/:id", controller.deleteProduct);

router.get("/create", controller.createProduct);

router.post("/create", upload.single('thumbnail'), validate.createPost, controller.createProductPost);

router.get("/edit/:id", controller.editProduct);

router.patch("/edit/:id", upload.single('thumbnail'), validate.createPost, controller.editProductPatch);

module.exports = router;
