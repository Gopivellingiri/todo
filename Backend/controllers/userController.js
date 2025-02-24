import User from "../models/UserModal.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//Generate JWT Token

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
};

const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ fullName, email, password });
  if (user) {
    const token = generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken(res, user._id);
    return res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token,
    });
  } else {
    return res.status(401).json({ message: "Invalid email or password" });
  }
};

export { registerUser, loginUser };
