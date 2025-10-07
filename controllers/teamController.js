// controllers/teamController.js
import Team from "../models/team.js";

// 🟢 Get all teams
export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().lean();
    res.json(teams);
  } catch (err) {
    console.error("❌ Error fetching teams:", err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

// 🟣 Create new team
export const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Team name is required" });

    const newTeam = await Team.create({ name, description, members: [] });

    // Return updated list so Angular updates instantly
    const teams = await Team.find().lean();
    res.status(201).json(teams);
  } catch (err) {
    console.error("❌ Error creating team:", err);
    res.status(500).json({ error: "Failed to create team" });
  }
};

// 🟠 Update team
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updatedTeam) return res.status(404).json({ error: "Team not found" });

    // Return updated list after update
    const teams = await Team.find().lean();
    res.json(teams);
  } catch (err) {
    console.error("❌ Error updating team:", err);
    res.status(500).json({ error: "Failed to update team" });
  }
};

// 🔴 Delete team
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Team.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Team not found" });

    // Return updated list after deletion
    const teams = await Team.find().lean();
    res.json(teams);
  } catch (err) {
    console.error("❌ Error deleting team:", err);
    res.status(500).json({ error: "Failed to delete team" });
  }
};
