import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  moveMember,
} from "../controllers/teamController.js";
import Team from "../models/team.js";

const router = express.Router();

router.get("/", getTeams);
router.post("/", authMiddleware, createTeam);
router.put("/:id", authMiddleware, updateTeam);
router.delete("/:id", authMiddleware, deleteTeam);
router.post("/add-member", authMiddleware, addMember);
router.post("/move-member", authMiddleware, moveMember);

/* 🆕 PUT: Reorder team members */
router.put("/:id/reorder", authMiddleware, async (req, res) => {
  try {
    const { members } = req.body;
    const teamId = req.params.id;

    if (!Array.isArray(members)) {
      return res.status(400).json({ error: "Members must be an array" });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { members },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json(updatedTeam);
  } catch (err) {
    console.error("❌ Error reordering members:", err);
    res.status(500).json({ error: "Failed to reorder members" });
  }
});

export default router;