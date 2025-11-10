const Skill = require("../models/Skill");

const getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find({ isActive: true })
            .select("-roadmap.steps.checklist -roadmap.steps.resources")
            .sort({ category: 1, title: 1 });
            
        res.json({
            success: true,
            data: skills,
            count: skills.length
        });
    } catch (error) {
        console.error("Get skills error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching skills"
        });
    }
};

const getSkillByKey = async (req, res) => {
    try {
        const skill = await Skill.findOne({ 
            key: req.params.key.toLowerCase(),
            isActive: true 
        });
        
        if (!skill) {
            return res.status(404).json({
                success: false,
                message: "Skill not found"
            });
        }

        res.json({
            success: true,
            data: skill
        });
    } catch (error) {
        console.error("Get skill error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching skill"
        });
    }
};

const getSkillsByCategory = async (req, res) => {
    try {
        const skills = await Skill.find({ 
            category: req.params.category,
            isActive: true 
        })
        .select("-roadmap.steps.checklist -roadmap.steps.resources")
        .sort({ title: 1 });

        res.json({
            success: true,
            data: skills,
            count: skills.length
        });
    } catch (error) {
        console.error("Get skills by category error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching skills by category"
        });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Skill.distinct("category", { isActive: true });
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error("Get categories error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching categories"
        });
    }
};

module.exports = {
    getAllSkills,
    getSkillByKey,
    getSkillsByCategory,
    getCategories
};
