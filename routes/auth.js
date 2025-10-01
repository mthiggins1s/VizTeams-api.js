import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Fake login route (replace with real DB later)
router.post('/login', (req, res) => {
  const { username, email, password } = req.body;

  console.log("📥 Incoming login request body:", req.body);

  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing from .env");
    return res.status(500).json({ error: "Server misconfigured: JWT_SECRET missing" });
  }

  let tokenUser = null;

  // 🚨 Hardcoded demo credentials
  if (email === 'test@example.com' && password === 'password123') {
    tokenUser = { id: 1, email };
  } else if (username === 'test' && password === 'pass123') {
    tokenUser = { id: 2, username };
  }

  if (tokenUser) {
    console.log("✅ Login success for:", tokenUser);

    const token = jwt.sign(tokenUser, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  console.warn("❌ Invalid credentials:", { username, email, password });
  res.status(401).json({ error: 'Invalid credentials' });
});

export default router;
