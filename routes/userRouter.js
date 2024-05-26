const express = require("express");
const { userRegister, userLogin, sendOTP, verifyOTP} = require("../controllers/userController");
const router = express.Router();

router.post("/register",userRegister)
router.post('/send-otp',sendOTP)
router.post('/verify-otp',verifyOTP)
router.post("/login",userLogin)


module.exports = router