const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    fullname: { type: String },
    location: { type: String, default: "" },
    email: { type: String, lowercase: true },
    profilePhoto: { type: String, default: "http://localhost:3000/images/users/default.jpg" },
    provider: { type: String, enum: ["local", "github"] },
    providerId: { type: String, unique: true },
    password: { type: String },
    role: { type: String, required: true, default: "User" },
    phone: { type: String, default: "" },
    gender: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
