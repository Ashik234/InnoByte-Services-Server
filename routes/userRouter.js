const express = require("express");
const {
  userRegister,
  userLogin,
  sendOTP,
  verifyOTP,
  editProfile,
  imageUpload,
} = require("../controllers/userController");
const router = express.Router();
const upload = require("../helpers/multer");
router.post("/register", userRegister);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", userLogin);
router.post("/edit", editProfile);
router.post("/uploadimage", upload.single("image"), imageUpload);

module.exports = router;
