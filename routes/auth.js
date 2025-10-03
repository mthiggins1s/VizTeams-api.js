import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const router = express.Router();

// Helper: sign JWT
function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

// --- SIGNUP ---
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Incoming signup request body:", req.body);

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing from .env");
      return res.status(500).json({ error: "Server misconfigured" });
    }

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user
    const user = await User.create({ email, passwordHash });

    // Issue token
    const token = signToken(user);
    console.log("✅ Signup success for:", email);

    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📥 Incoming login request body:", req.body);

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing from .env");
      return res.status(500).json({ error: "Server misconfigured" });
    }

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      console.warn("❌ Login failed: user not found");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.warn("❌ Login failed: bad password");
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Issue token
    const token = signToken(user);
    console.log("✅ Login success for:", email);

    return res.json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
