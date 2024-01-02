const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/employeeController");
const CheckAdmin = require("../../config/CheckAdmin");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/employee/"); // Đường dẫn đến thư mục lưu trữ tệp tin
  },
  filename: function (req, file, cb) {
    // Tạo tên tệp tin duy nhất bằng cách kết hợp timestamp và tên gốc của tệp tin
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", CheckAdmin, Controller.getList);

router.post(
  "/create",
  CheckAdmin,
  upload.single("imageInput"),
  Controller.postCreate
);

router.post(
  "/update",
  CheckAdmin,
  upload.single("imageInput"),
  Controller.postUpdate
);

router.post("/delete", CheckAdmin, Controller.postDelete);

module.exports = router;
