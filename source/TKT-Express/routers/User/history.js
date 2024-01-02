const express = require("express");
const router = express.Router();
const Controller = require("../../controllers/historyController");
const CheckUser = require("../../config/CheckUser");

router.get("/", CheckUser, Controller.getView);

router.post("/update", CheckUser, Controller.postUpdate);

router.post("/delete/:id", CheckUser, Controller.postDelete);

module.exports = router;
