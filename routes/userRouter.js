const express = require("express");
const {
  userRegister,
  userLogin,
  verifyOTP,
  editProfile,
  imageUpload,
  sendOTP,
} = require("../controllers/userController");
const router = express.Router();
const upload = require("../helpers/multer");
router.post("/register", userRegister);
router.post("/verify-otp", verifyOTP);
router.post("/send-otp", sendOTP);
router.post("/login", userLogin);
router.post("/edit", editProfile);
router.post("/uploadimage", upload.single("image"), imageUpload);

module.exports = router;
