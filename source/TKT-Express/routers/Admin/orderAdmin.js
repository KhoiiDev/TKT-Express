const express = require("express");
const router = express.Router();
const OrderAdmin = require("../../controllers/orderAdminControlller");
const CheckAdmin = require("../../config/CheckAdmin");

router.get("/", CheckAdmin, OrderAdmin.getList);
module.exports = router;
