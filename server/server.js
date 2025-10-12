// ✅ Auto-load .env before anything else
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import authRoutes from '../routes/auth.js';
import teamRoutes from "../routes/team.js";
import authMiddleware from '../middleware/authMiddleware.js';
import picsumRoutes from "../routes/picsum.js";
import memberRoutes from "../routes/members.js";


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

// 🔹 Root route (health check)
app.get("/", (req, res) => {
  res.json({
    message: "Hello from VizTeams API 🚀",
    mongoStatus: mongoose.connection.readyState === 1 ? "Connected ✅" : "Not Connected ❌"
  });
});

// 🔹 Auth routes (login, signup, etc.)
app.use('/', authRoutes);
app.use('/api/teams', teamRoutes);
app.use("/api", picsumRoutes);
app.use("/api/members", memberRoutes);

// 🔹 Protected route example
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: `Hello, user ${req.user.id}` });
});

const PORT = process.env.PORT || 3000;
console.log("🧠 About to start listening on port", PORT);
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running on port ${PORT}`));