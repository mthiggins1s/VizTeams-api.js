import express from "express";
import mongoose from "mongoose";
import Team from "../models/team.js";

const router = express.Router();

// POST: Add a new member to a specific team
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

    // 🆕 Create new member (ensure avatarUrl always exists)
    const newMember = {
      _id: new mongoose.Types.ObjectId(),
      name: member.name,
      title: member.title,
      avatarUrl: member.avatarUrl || "", // ensure always saved
    };

    console.log("👤 Adding new member:", newMember);

    // 💾 Save to team
    team.members.push(newMember);
    await team.save();

    // 🧾 Fetch fresh updated team
    const updatedTeam = await Team.findById(teamId).lean();

    console.log("✅ Successfully added member!");
    console.log("📤 Updated team members:", updatedTeam.members.length);
    console.log("🖼️ Avatar URL of new member:", newMember.avatarUrl || "(none)");

    res.status(201).json(updatedTeam);
  } catch (err) {
    console.error("❌ Error adding member:", err.message);
    console.error(err.stack);
    res.status(500).json({ error: "Failed to add member" });
  }
});

export default router;
