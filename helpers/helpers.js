const userModel = require("../models/userModel");

async function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

module.exports = { generateOTP };
