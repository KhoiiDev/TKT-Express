const express = require("express");
const router = express.Router();
const Controller = require("../controllers/shipController");
const CheckEmployee = require("../config/CheckEmployee");

router.get("/", CheckEmployee,  Controller.getView);

router.get("/myOrder", CheckEmployee,  Controller.showOrder);

router.post("/addOrder", CheckEmployee,  Controller.getOrder);

router.post("/update", CheckEmployee, Controller.postUpdateShip);
router.post("/updatePayment", CheckEmployee, Controller.postUpdatePayment);

module.exports = router;