// routes/auth.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import cookieParser from "cookie-parser";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
app.use(express.json());
app.use(cookieParser());

// Register
router.post("/register", async (req, res) => {
  const { name , username , email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ name , username , email, password: hash, watchlist: [] });
    await newUser.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    // console.log(email , password);
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "2h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 2 * 60 * 60 * 1000
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/"           // <-- must match login
  });

  res.status(200).json({ message: "Logged out successfully" });
});



export default router;
