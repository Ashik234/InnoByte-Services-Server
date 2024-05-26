const userModel = require("../models/userModel");

async function generateOTP() {
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

async function usernameGenerator(name) {
  let username = "";
  const firstName = name.split(" ")[0]; // Get the first name

  do {
    const randomNumber = Math.floor(Math.random() * 1000);
    username = `${firstName}${randomNumber}`;
  } while (await checkIfUsernameExists(username)); // Check if the username exists

  return username;
}

async function checkIfUsernameExists(username) {
  return (await userModel.findOne({ username: username })) != null;
}

module.exports = { generateOTP, usernameGenerator };
