"use strict";

var express = require("express");

var router = express.Router();

var Controller = require("../../controllers/userController");

var CheckAdminLogin = require("../../config/CheckAdmin");

var multer = require("multer");

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "public/images/users"); // Đường dẫn đến thư mục lưu trữ tệp tin
  },
  filename: function filename(req, file, cb) {
    // Tạo tên tệp tin duy nhất bằng cách kết hợp timestamp và tên gốc của tệp tin
    var uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});
var upload = multer({
  storage: storage
});
router.get("/", Controller.getList);
router.post("/create", upload.single("imageInput"), Controller.postCreate);
router.post("/update", CheckAdminLogin, upload.single("imageEditInput"), Controller.postUpdate);
router.post("/delete", CheckAdminLogin, Controller.postDelete);
router.get("/logout", CheckAdminLogin, Controller.logout);
module.exports = router;