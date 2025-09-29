// ✅ Auto-load .env before anything else
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from '../routes/auth.js';
import authMiddleware from '../middleware/authMiddleware.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Debug check
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);

// 🔹 Auth routes (login)
app.use('/', authRoutes);

// 🔹 Protected route example
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: `Hello, user ${req.user.id}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Notes for Matthew
    // this file is the entry point for the tokens
    // .env is loaded so the secret is made available
    // we setup cors() so we can talk to Angular