// importMockData.js
import mongoose from "mongoose";
import XLSX from "xlsx";
import dotenv from "dotenv";
dotenv.config();

// --- 1. Connect to MongoDB ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Connection error:", err));

// --- 2. Define your schema ---
const teamSchema = new mongoose.Schema({
  teamName: String,
  members: [String], // or use [{ name: String, role: String }] later if you want
});

const Team = mongoose.model("Team", teamSchema);

// --- 3. Read the Excel file ---
const workbook = XLSX.readFile("./data/TeamAndMemberMockData.xlsx");
const sheetName = workbook.SheetNames[0];
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

console.log("📋 Parsed Excel data:", data);

// --- 4. Transform and insert into MongoDB ---
async function importData() {
  try {
    const formattedData = data.map((row) => ({
      teamName: row["Team Name"] || row["teamName"],
      members: row["Members"]
        ? row["Members"].split(",").map((m) => m.trim())
        : [],
    }));

    await Team.deleteMany(); // optional: clears old data
    await Team.insertMany(formattedData);

    console.log(`✅ Imported ${formattedData.length} records successfully!`);
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  } finally {
    mongoose.connection.close();
  }
}

importData();
