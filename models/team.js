import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: String,
  title: String,
  avatarUrl: { type: String, default: "" },
});

const teamSchema = new mongoose.Schema({
  teamName: String,
  description: String,
  members: [memberSchema],
});

export default mongoose.model("Team", teamSchema);
