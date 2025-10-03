// ✅ Auto-load .env before anything else
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import authRoutes from '../routes/auth.js';
import authMiddleware from '../middleware/authMiddleware.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Debug check
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);

// 🔹 Connect to MongoDB Atlas
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 🔹 Auth routes (login)
app.use('/', authRoutes);

// 🔹 Protected route example
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: `Hello, user ${req.user.id}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));