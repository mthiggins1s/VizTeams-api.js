import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();
// Fake login route (replace with real DB later)
//TODO: Add persistence once MongoDB is set up
router.post("/login", (req, res) => {
  const { username, email, password } = req.body;
  console.log("📥 Incoming login request body:", req.body);
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing from .env");
    return res
      .status(500)
      .json({ error: "Server misconfigured: JWT_SECRET missing" });
  }
  let tokenUser = null;
  // 🚨 Hardcoded demo credentials
  if (email === "test@example.com" && password === "password123") {
    tokenUser = { id: 1, email };
  } else if (username === "test" && password === "pass123") {
    tokenUser = { id: 2, username };
  }
  if (tokenUser) {
    console.log("✅ Login success for:", tokenUser);
    const token = jwt.sign(tokenUser, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  }
  console.warn("❌ Invalid credentials:", { username, email, password });
  res.status(401).json({ error: "Invalid credentials" });
});
// Test signup route (localStorage only, returns token immediately)
//TODO: Add persistence once MongoDB is set up
router.post("/signup", (req, res) => {
  const { email, password } = req.body;
  console.log("📥 Incoming signup request body:", req.body);
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing from .env");
    return res
      .status(500)
      .json({ error: "Server misconfigured: JWT_SECRET missing" });
  }
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  // Went ahead and added a fake id field (signup timestamp for now) to get started
  // TODO: check for existing user and hash passwords before storing
  const tokenUser = { id: Date.now(), email };
  const token = jwt.sign(tokenUser, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  console.log("✅ Signup success for:", email);
  res.json({ token });
});

export default router;