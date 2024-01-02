const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/homeController");
const CheckLogin = require("../../config/CheckUser");
const isAuth = require("../../config/auth");

router.get("/", Controller.getHome);
router.get("/dashboard", CheckLogin, Controller.getHome);
router.get("/notifications", CheckLogin, Controller.getNotifications);

module.exports = router;
