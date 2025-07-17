import usermodel from "../models/usermodel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user not exist " });
    }
    const ismatch = await bcrypt.compare(password, user.password);
    if (ismatch) {
      const token = createtoken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const registeruser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //checking user exist or not
    const exist = await usermodel.findOne({ email });
    if (exist) {
      return res.json({ success: false, message: "user already exist " });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newuser = new usermodel({
      name,
      email,
      password: hashedpassword,
    });

    const user = await newuser.save();

    const token = createtoken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const adminlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const secret = process.env.JWT_SECRET;

const token = jwt.sign({ email, password }, secret);

      console.log("✅ [adminlogin] Token generated:", token);
      return res.json({ success: true, token });
    } else {
      console.warn("❌ [adminlogin] Invalid credentials");
      return res.json({ success: false, message: "invalid credentials" });
    }
  } catch (error) {
    console.error("💥 [adminlogin] Error:", error);
    res.json({ success: false, message: error.message });
  }
};



export { loginuser, registeruser, adminlogin };
