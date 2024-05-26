const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // contactNumber: { type: String, unique: true },
  isVerified: { type: Boolean, required: true, default: false },
  about: { type: String, required: false },
  otp: {
    code: { type: String, required: true },
    expiry: { type: Date, required: true },
  },
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
