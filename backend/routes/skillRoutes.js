const express = require("express");
const { 
    getAllSkills, 
    getSkillByKey, 
    getSkillsByCategory, 
    getCategories 
} = require("../controllers/skillController");

const router = express.Router();

router.get("/", getAllSkills);
router.get("/categories", getCategories);
router.get("/category/:category", getSkillsByCategory);
router.get("/:key", getSkillByKey);

module.exports = router;
