// routes/team.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../controllers/teamController.js";

const router = express.Router();

// Routes
router.get("/", getTeams); // public
router.post("/", authMiddleware, createTeam);
router.put("/:id", authMiddleware, updateTeam);
router.delete("/:id", authMiddleware, deleteTeam);

export default router;
