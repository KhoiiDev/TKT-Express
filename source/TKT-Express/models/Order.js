const mongoose = require("mongoose");

// Define Order Schema
const orderSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    senderUserName: {
        type: String,
        required: true,
    },
    senderPhone: {
        type: String,
        required: true,
    },
    senderEmail: {
        type: String,
        required: true,
    },
    senderAddress: {
        type: String,
        required: true,
    },
    senderProvince: {
        type: String,
        required: true,
    },
    receiverUserName: {
        type: String,
        required: true,
    },
    receiverPhone: {
        type: String,
        required: true,
    },
    receiverAddress: {
        type: String,
        required: true,
    },
    receiverProvince: {
        type: String,
        required: true,
    },
    itemCategory: {
        type: String,
        required: true,
    },
    itemImage: {
        type: String,
        required: true,
    },
    itemWeight: {
        type: String,
        required: true,
    },
    itemDetails: {
        type: String,
        required: true,
    },
    cost: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    orderDate: {
        type: String,
        required: true,
    },
    shipments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shipments",
        options: { strictPopulate: false }
    },
    payments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payments",
        options: { strictPopulate: false }
    },
});

// Create Order Model
const Order = mongoose.model("Order", orderSchema);

// Export the Order Model
module.exports = Order;