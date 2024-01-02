const mongoose = require("mongoose");

// Define Transportation Schema
const shipmentSchema = new mongoose.Schema({
  shipAddress: {
    type: String,
    required: true,
  },
  shipmentTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In transit", "Delivered"],
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employees",
    required: true,
  }
});

const Shipment = mongoose.model("shipments", shipmentSchema);
module.exports = Shipment;