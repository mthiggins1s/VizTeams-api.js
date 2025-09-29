import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Fake login route (replace with real DB later)
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: "Server misconfigured: JWT_SECRET missing" });
  }

  // 🚨 Hardcoded demo credentials
  if (email === 'test@example.com' && password === 'password123') {
    const token = jwt.sign(
      { id: 1, email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.json({ token });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

export default router;

// Notes for Matthew
    // This is where we login and issue the tokens to users
    // Since this is just for testing, a hard coded user is created to see if the user is granted a token
        // whenever a email and password is provided!