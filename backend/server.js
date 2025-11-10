const express = require("express");
const dotenv = require("dotenv");
const app = express();
const connectDB = require("./config/database");
dotenv.config();


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 SkillPath Backend is running!",
        timestamp: new Date().toISOString()
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "✅ Server is healthy",
        environment: process.env.NODE_ENV
    });
});
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("🌈 SkillPath Server running on port " + PORT);
    console.log("📍 http://localhost:" + PORT);
    console.log("🔗 Health check: http://localhost:" + PORT + "/api/health");
});
