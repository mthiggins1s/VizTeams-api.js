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
    if (!teamName)
      return res.status(400).json({ error: "Team name is required" });

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

    if (!updatedTeam)
      return res.status(404).json({ error: "Team not found" });

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

    if (!deleted)
      return res.status(404).json({ error: "Team not found" });

    res.json({ message: "Team deleted successfully", id });
  } catch (err) {
    console.error("❌ Error deleting team:", err);
    res.status(500).json({ error: "Failed to delete team" });
  }
};

/** POST: add a member to a team */
export const addMember = async (req, res) => {
  try {
    const { teamId, firstName, lastName, title, avatarUrl } = req.body;

    if (!teamId)
      return res.status(400).json({ error: "teamId is required" });

    const team = await Team.findById(teamId);
    if (!team)
      return res.status(404).json({ error: "Team not found" });

    const member = {
      name: `${firstName} ${lastName}`,
      title,
      avatarUrl,
    };

    team.members.push(member);
    await team.save();

    res.status(201).json({ message: "Member added successfully", member });
  } catch (err) {
    console.error("❌ Error adding member:", err);
    res.status(500).json({ error: "Failed to add member" });
  }

  if (team.members.some(m => m.name === `${firstName} ${lastName}`)) {
  return res.status(400).json({ error: "Member already exists" });
}
};

/** POST: move an existing member from one team to another (optionally to a specific index) */
export const moveMember = async (req, res) => {
  try {
    const { memberId, fromTeamId, toTeamId, toIndex } = req.body || {};

    if (!memberId || !fromTeamId || !toTeamId) {
      return res
        .status(400)
        .json({ error: "memberId, fromTeamId and toTeamId are required" });
    }

    if (fromTeamId === toTeamId) {
      // Moving within same team should be handled by reorder endpoint
      return res.status(400).json({ error: "Use reorder for intra-team moves" });
    }

    const fromTeam = await Team.findById(fromTeamId);
    if (!fromTeam) return res.status(404).json({ error: "Source team not found" });

    const memberIdx = fromTeam.members.findIndex(
      (m) => m._id?.toString() === String(memberId)
    );
    if (memberIdx === -1) return res.status(404).json({ error: "Member not in source team" });

    // Remove from source
    const [member] = fromTeam.members.splice(memberIdx, 1);
    await fromTeam.save();

    // Add to destination
    const toTeam = await Team.findById(toTeamId);
    if (!toTeam) return res.status(404).json({ error: "Destination team not found" });

    const insertIndex = Number.isInteger(toIndex)
      ? Math.max(0, Math.min(Number(toIndex), toTeam.members.length))
      : toTeam.members.length;

    toTeam.members.splice(insertIndex, 0, member);
    await toTeam.save();

    // Return both updated teams to allow client to refresh local state
    const [fromTeamFresh, toTeamFresh] = await Promise.all([
      Team.findById(fromTeamId).lean(),
      Team.findById(toTeamId).lean(),
    ]);

    return res.status(200).json({ fromTeam: fromTeamFresh, toTeam: toTeamFresh });
  } catch (err) {
    console.error("❌ Error moving member:", err);
    return res.status(500).json({ error: "Failed to move member" });
  }
};
