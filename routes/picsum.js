import express from "express";
import axios from "axios";

const router = express.Router();

// ✅ Correct: define only `/` here
router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://picsum.photos/v2/list?limit=100");
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error fetching Picsum photos:", err.message);
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

export default router;
