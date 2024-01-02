const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/profileControllers");
const CheckLogin = require("../../config/CheckUser");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/users"); // Đường dẫn đến thư mục lưu trữ tệp tin
  },
  filename: function (req, file, cb) {
    // Tạo tên tệp tin duy nhất bằng cách kết hợp timestamp và tên gốc của tệp tin
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", CheckLogin, Controller.getView);

router.post(
  "/update",
  CheckLogin,
  upload.single("profilePhoto"),
  Controller.postUpdate
);

module.exports = router;
