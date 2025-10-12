import Team from "../models/team.js";

/** GET all teams */
export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().lean();
    res.json(teams);
  } catch (err) {
    console.error("❌ Error fetching teams:", err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

/** POST: create a new team */
export const createTeam = async (req, res) => {
  try {
    const { teamName, description } = req.body;
    if (!teamName) return res.status(400).json({ error: "Team name is required" });

    const newTeam = await Team.create({ teamName, description, members: [] });
    res.status(201).json(newTeam);
  } catch (err) {
    console.error("❌ Error creating team:", err);
    res.status(500).json({ error: "Failed to create team" });
  }
};

/** PUT: update an existing team */
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { teamName, description } = req.body;

    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      { teamName, description },
      { new: true }
    );

    if (!updatedTeam) return res.status(404).json({ error: "Team not found" });

    res.json(updatedTeam);
  } catch (err) {
    console.error("❌ Error updating team:", err);
    res.status(500).json({ error: "Failed to update team" });
  }
};

/** DELETE: remove a team */
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Team.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Team not found" });

    res.json({ message: "Team deleted successfully", id });
  } catch (err) {
    console.error("❌ Error deleting team:", err);
    res.status(500).json({ error: "Failed to delete team" });
  }
};
