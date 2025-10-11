import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: String,
  title: String,
  avatarUrl: String,
});

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  description: String,
  members: [memberSchema],
});

export default mongoose.model("Team", teamSchema);
