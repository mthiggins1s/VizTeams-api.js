import express from "express";
import mongoose from "mongoose";
import Team from "../models/team.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* 🟢 POST: Add a new member to a specific team                               */
/* -------------------------------------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    console.log("🟢 [POST] /api/members hit!");
    console.log("📥 Incoming headers:", req.headers["content-type"]);
    console.log("📦 Raw request body:", req.body);

    const { teamId, member } = req.body || {};
    console.log("🧩 Parsed teamId:", teamId);
    console.log("🧑 Parsed member:", member);

    // 🚨 Validate fields
    if (!teamId || !member?.name || !member?.title) {
      console.warn("⚠️ Missing required fields:", { teamId, member });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 🧠 Check if team exists
    const team = await Team.findById(teamId);
    if (!team) {
      console.warn(`❌ Team not found for ID: ${teamId}`);
      return res.status(404).json({ error: "Team not found" });
    }

    console.log(`✅ Found team: ${team.teamName} (${team._id})`);

    // 🆕 Create new member
    const newMember = {
      _id: new mongoose.Types.ObjectId(),
      name: member.name,
      title: member.title,
      avatarUrl: member.avatarUrl || "",
    };

    console.log("👤 Adding new member:", newMember);

    // 💾 Save to team
    team.members.push(newMember);
    await team.save();

    // 🧾 Fetch updated team
    const updatedTeam = await Team.findById(teamId).lean();

    console.log("✅ Successfully added member!");
    console.log("📤 Updated team members:", updatedTeam.members.length);

    res.status(201).json(updatedTeam);
  } catch (err) {
    console.error("❌ Error adding member:", err.message);
    console.error(err.stack);
    res.status(500).json({ error: "Failed to add member" });
  }
});

/* -------------------------------------------------------------------------- */
/* ✏️ PUT: Update an existing member in a specific team                       */
/* -------------------------------------------------------------------------- */
router.put("/:teamId/members/:memberId", async (req, res) => {
  try {
    console.log("🟣 [PUT] /api/members/:teamId/members/:memberId hit!");
    console.log("📥 Request body:", req.body);

    const { teamId, memberId } = req.params;
    const { firstName, lastName, title, avatarUrl } = req.body;

    if (!teamId || !memberId) {
      console.warn("⚠️ Missing teamId or memberId:", { teamId, memberId });
      return res.status(400).json({ error: "Missing teamId or memberId" });
    }

    // 🧠 Find the team
    const team = await Team.findById(teamId);
    if (!team) {
      console.warn(`❌ Team not found for ID: ${teamId}`);
      return res.status(404).json({ error: "Team not found" });
    }

    // 🧩 Find member in team
    const memberIndex = team.members.findIndex(
      (m) => m._id.toString() === memberId
    );
    if (memberIndex === -1) {
      console.warn(`⚠️ Member not found in team: ${memberId}`);
      return res.status(404).json({ error: "Member not found" });
    }

    // 🧱 Update member fields
    const fullName = `${firstName?.trim() || ""} ${lastName?.trim() || ""}`.trim();
    team.members[memberIndex].name = fullName;
    team.members[memberIndex].title = title;
    team.members[memberIndex].avatarUrl = avatarUrl || "";

    await team.save();

    console.log("✅ Member updated successfully:", team.members[memberIndex]);

    res.status(200).json(team.members[memberIndex]);
  } catch (err) {
    console.error("❌ Error updating member:", err.message);
    console.error(err.stack);
    res.status(500).json({ error: "Failed to update member" });
  }
});

export default router;
