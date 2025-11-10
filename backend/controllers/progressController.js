const UserProgress = require("../models/UserProgress");
const Skill = require("../models/Skill");

const getUserProgress = async (req, res) => {
    try {
        const progress = await UserProgress.find({ userId: req.session.userId })
            .populate("skillId", "key title icon category level description duration")
            .sort({ lastAccessed: -1 });
        
        res.json({
            success: true,
            data: progress
        });
    } catch (error) {
        console.error("Get user progress error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user progress"
        });
    }
};

const updateProgress = async (req, res) => {
    try {
        const { skillKey, stepIndex, itemIndex, completed } = req.body;
        
        if (skillKey === undefined || stepIndex === undefined || itemIndex === undefined || completed === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: skillKey, stepIndex, itemIndex, completed"
            });
        }

        const skill = await Skill.findOne({ key: skillKey.toLowerCase(), isActive: true });
        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found"
            });
        }

        let userProgress = await UserProgress.findOne({
            userId: req.session.userId,
            skillId: skill._id
        });

        if (!userProgress) {
            userProgress = new UserProgress({
                userId: req.session.userId,
                skillId: skill._id,
                steps: new Map()
            });
        }

        const stepKey = stepIndex.toString();
        if (!userProgress.steps.get(stepKey)) {
            userProgress.steps.set(stepKey, {
                checklist: new Map(),
                completedAt: null
            });
        }

        const step = userProgress.steps.get(stepKey);
        step.checklist.set(itemIndex.toString(), completed);

        const totalItems = skill.roadmap.steps.reduce((total, step) => total + step.checklist.length, 0);
        let completedItems = 0;

        userProgress.steps.forEach((stepData) => {
            stepData.checklist.forEach((isCompleted) => {
                if (isCompleted) completedItems++;
            });
        });

        userProgress.progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        userProgress.lastAccessed = new Date();

        await userProgress.save();

        await userProgress.populate("skillId", "key title icon category level");

        res.json({
            success: true,
            data: userProgress,
            message: completed ? "Progress updated! ✅" : "Item unchecked"
        });
    } catch (error) {
        console.error("Update progress error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating progress"
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const progress = await UserProgress.find({ userId: req.session.userId })
            .populate("skillId", "title icon category level");

        const skillsStarted = progress.length;
        const skillsCompleted = progress.filter(p => p.progress === 100).length;
        
        const totalProgress = progress.length > 0 
            ? progress.reduce((sum, p) => sum + p.progress, 0) / progress.length 
            : 0;

        const streakDays = 7;

        const recentProgress = progress
            .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
            .slice(0, 5);

        res.json({
            success: true,
            data: {
                skillsStarted,
                skillsCompleted,
                totalProgress: Math.round(totalProgress),
                streakDays,
                recentProgress
            }
        });
    } catch (error) {
        console.error("Get dashboard stats error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard statistics"
        });
    }
};

const getSkillProgress = async (req, res) => {
    try {
        const { skillKey } = req.params;
        
        const skill = await Skill.findOne({ key: skillKey.toLowerCase(), isActive: true });
        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found"
            });
        }

        const progress = await UserProgress.findOne({
            userId: req.session.userId,
            skillId: skill._id
        }).populate("skillId");

        res.json({
            success: true,
            data: progress || {
                skillId: skill,
                progress: 0,
                steps: new Map(),
                startedAt: null
            }
        });
    } catch (error) {
        console.error("Get skill progress error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching skill progress"
        });
    }
};

module.exports = {
    getUserProgress,
    updateProgress,
    getDashboardStats,
    getSkillProgress
};
