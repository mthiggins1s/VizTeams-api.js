import mongoose from "mongoose";
import XLSX from "xlsx";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ Connection error:", err));

const teamSchema = new mongoose.Schema({
  teamName: String,
  description: String,
  members: [{ name: String, title: String }],
});

const Team = mongoose.model("Team", teamSchema);

const workbook = XLSX.readFile("./data/TeamAndMemberMockData.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

console.log(`📋 Loaded ${rows.length} rows from Excel.`);

// --- Build map keyed by the "Team" column (column E) ---
const teamsMap = new Map();

for (const row of rows) {
  const memberTeam = row["Team"]; // 👈 key column for grouping members
  const topTeamName = row["Team Name"];
  const description = row["Description"];
  const name = row["First and Last Name"];
  const title = row["Title"];

  // Skip empty rows
  if (!memberTeam && !topTeamName) continue;

  // Determine actual team name
  const teamName = memberTeam || topTeamName;

  if (!teamsMap.has(teamName)) {
    teamsMap.set(teamName, {
      teamName,
      description:
        description ||
        (rows.find((r) => r["Team Name"] === teamName)?.["Description"] ?? ""),
      members: [],
    });
  }

  // Add members
  if (name) {
    teamsMap.get(teamName).members.push({
      name,
      title: title || "",
    });
  }
}

const formattedTeams = Array.from(teamsMap.values());

async function importData() {
  try {
    await Team.deleteMany();
    await Team.insertMany(formattedTeams);
    console.log(`✅ Imported ${formattedTeams.length} teams successfully!`);
    formattedTeams.forEach((t) => {
      console.log(
        `📦 ${t.teamName}: ${t.members.length} members → ${t.members
          .map((m) => m.name)
          .join(", ")}`
      );
    });
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  } finally {
    mongoose.connection.close();
  }
}

importData();
