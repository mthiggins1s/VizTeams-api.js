import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {getTeams, createTeam, updateTeam, deleteTeam,
} from "../controllers/teamController.js";

const router = express.Router();

router.get("/", getTeams);

router.post("/", authMiddleware, createTeam);

router.put("/:id", authMiddleware, updateTeam);

router.delete("/:id", authMiddleware, deleteTeam);

export default router;
