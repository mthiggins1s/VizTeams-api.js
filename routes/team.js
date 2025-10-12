import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
} from "../controllers/teamController.js";

const router = express.Router();

// Routes
router.get("/", getTeams);
router.post("/", authMiddleware, createTeam);
router.put("/:id", authMiddleware, updateTeam);
router.delete("/:id", authMiddleware, deleteTeam);
router.post("/add-member", authMiddleware, addMember);

export default router;
