const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { sendOTPviaMail } = require("../services/nodemailer");
const { generateOTP } = require("../helpers/helpers");
const { uploadToCloudinary } = require("../config/Cloudinary");

const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await userModel.findOne({ email: email });
    if (exists) {
      return res
        .status(400)
        .json({ exists: true, message: "Email already exists" });
    } else {
      const otp = await generateOTP();
      sendOTPviaMail(email, otp);
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);
      let user = await userModel.create({
        username,
        email,
        password: hashedpassword,
        otp: {
          code: otp,
          expiry: Date.now() + 60000,
        },
      });
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: 6000000,
      });
      res.status(201).json({
        message: "Registration Completed Successfully",
        token,
        status: true,
        user
      });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;
    if (!otp || !email)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    } else if (user.otp.code !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    } else if (user.otp.expiry.getTime() < Date.now()) {
      return res.status(401).json({ success: false, message: "OTP expired" });
    }

    if (!user.isVerified) {
      await userModel.findOneAndUpdate(
        { email: email },
        { $set: { isVerified: true } }
      );
    }

    return res
      .status(200)
      .json({ success: true, message: "Successfully Verified" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const isUserExist = (await userModel.countDocuments({ email: email })) > 0;

    if (!isUserExist)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const otp = await generateOTP();
    sendOTPviaMail(email, otp);

    await userModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          otp: {
            code: otp,
            expiry: Date.now() + 60000,
          },
        },
      }
    );

    return res
      .status(200)
      .json({ success: true, message: "OTP successfully sent" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const exists = await userModel.findOne({ email: email });
    if (exists) {
      const access = await bcrypt.compare(password.toString(), exists.password);
      if (access) {
        const token = jwt.sign({ userId: exists._id }, process.env.JWT_SECRET, {
          expiresIn: 6000000,
        });
        return res.status(200).json({
          user: exists,
          token: token,
          message: "Login Successfull",
          status: true,
        });
      } else {
        return res
          .status(404)
          .json({ message: "Email or Password is wrong", status: false });
      }
    } else {
      return res
        .status(201)
        .json({ message: "This Email is Not Registered", status: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};

const editProfile = async (req, res) => {
  try {
    const {userId, username, contact, about } = req.body;
    console.log(req.body);
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { username, contact, about },
      { new: true }
    );
    console.log(updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    return res
      .status(200)
      .json({ success: true, user: updatedUser, message: "Profile Updated" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

const imageUpload = async(req,res)=>{
  try {
    const {userId}=req.body
    console.log(req.body);
    const url = req.file.path;
     const data = await uploadToCloudinary(url, "profile");
    const image = data.url;
    console.log(image);
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { imageUrl:image},
      { new: true }
    );
    console.log(updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    return res
      .status(200)
      .json({ success: true, user: updatedUser, message: "Profile Updated" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server Error" });
    
  }
}

module.exports = {
  userRegister,
  userLogin,
  verifyOTP,
  sendOTP,
  editProfile,
  imageUpload
};
