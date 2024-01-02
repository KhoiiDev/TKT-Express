const mongoose = require("mongoose");

// Define Employee Schema
const paymentSchema = new mongoose.Schema({
    codePay: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
});

// Create Employee Model
const Payment = mongoose.model("payments", paymentSchema);

// Export the Employee Model
module.exports = Payment;