const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const userRegister = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;
    const exists = await userModel.findOne({ email: email });
    if (exists) {
      return res
        .status(400)
        .json({ exists: true, message: "Email already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);

      let user = await userModel.create({
        username,
        email,
        password: hashedpassword,
      });
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: 6000000,
      });

      res.status(201).json({
        message: "Registration Completed Successfully",
        token,
        status: true,
      });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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





module.exports = {
  userRegister,
  userLogin,
};
