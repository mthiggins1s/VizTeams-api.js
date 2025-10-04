// importMockData.js
import mongoose from "mongoose";
import XLSX from "xlsx";
import dotenv from "dotenv";
dotenv.config();

// --- 1. Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Connection error:", err));

// --- 2. Define your schema ---
// (adjust fields based on your Excel sheet columns)
const teamSchema = new mongoose.Schema({
  teamName: String,
  members: [String],   // or more detailed objects if needed
});

const Team = mongoose.model("Team", teamSchema);

// --- 3. Read the Excel file ---
const workbook = XLSX.readFile("./data/TeamAndMemberMockData.xlsx");
const sheetName = workbook.SheetNames[0];
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

console.log("📋 Parsed Excel data:", data);

// --- 4. Insert into MongoDB ---
async function importData() {
  try {
    await Team.insertMany(data);
    console.log("✅ Data successfully inserted!");
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  } finally {
    mongoose.connection.close();
  }
}

importData();
