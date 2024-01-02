const mongoose = require("mongoose");

// Define Employee Schema
const employeeSchema = new mongoose.Schema({
  position: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  workplace: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

// Create Employee Model
const Employee = mongoose.model("Employees", employeeSchema);

// Export the Employee Model
module.exports = Employee;