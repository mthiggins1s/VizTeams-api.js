import express from "express";
import Team from "../models/team.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 GET all teams
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find().lean();
    res.json(teams);
  } catch (err) {
    console.error("❌ Error fetching teams:", err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

// 🔹 POST new team (protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Team name is required" });

    const newTeam = await Team.create({ name, description, members: [] });
    res.status(201).json(newTeam);
  } catch (err) {
    console.error("❌ Error creating team:", err);
    res.status(500).json({ error: "Failed to create team" });
  }
});

// 🔹 PUT update team (protected)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updatedTeam) return res.status(404).json({ error: "Team not found" });

    res.json(updatedTeam);
  } catch (err) {
    console.error("❌ Error updating team:", err);
    res.status(500).json({ error: "Failed to update team" });
  }
});

// 🔹 DELETE team (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Team.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Team not found" });

    res.json({ message: "Team deleted successfully", id });
  } catch (err) {
    console.error("❌ Error deleting team:", err);
    res.status(500).json({ error: "Failed to delete team" });
  }
});

export default router;