const express = require("express");
const { 
    getUserProgress, 
    updateProgress, 
    getDashboardStats,
    getSkillProgress 
} = require("../controllers/progressController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", getUserProgress);
router.get("/dashboard", getDashboardStats);
router.get("/skill/:skillKey", getSkillProgress);
router.post("/update", updateProgress);

module.exports = router;
