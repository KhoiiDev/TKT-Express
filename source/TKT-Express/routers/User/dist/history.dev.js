"use strict";

var express = require("express");

var router = express.Router();

var Controller = require("../../controllers/historyController");

var CheckLogin = require("../../config/CheckUser");

router.get("/", CheckLogin, Controller.getView);
router.post("/update", CheckLogin, Controller.postUpdate);
router.post("/delete/:id", CheckLogin, Controller.postDelete);
module.exports = router;