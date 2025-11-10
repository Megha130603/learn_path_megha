const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});

const stepSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    checklist: [{
        type: String,
        required: true
    }],
    resources: [resourceSchema]
});

const skillSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    title: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["programming", "design", "business", "data", "cloud"]
    },
    level: {
        type: String,
        required: true,
        enum: ["beginner", "intermediate", "advanced"]
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    popularity: {
        type: String,
        required: true
    },
    roadmap: {
        flowchart: [[{
            type: String,
            required: true
        }]],
        steps: [stepSchema]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

skillSchema.index({ category: 1, level: 1 });
skillSchema.index({ key: 1 });

module.exports = mongoose.model("Skill", skillSchema);
