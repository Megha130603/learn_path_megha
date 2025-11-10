const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: true
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    steps: {
        type: Map,
        of: {
            checklist: {
                type: Map,
                of: Boolean
            },
            completedAt: Date
        },
        default: {}
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

userProgressSchema.index({ userId: 1, skillId: 1 }, { unique: true });

userProgressSchema.pre("save", function(next) {
    this.lastAccessed = new Date();
    
    if (this.progress === 100 && !this.completedAt) {
        this.completedAt = new Date();
    }
    
    next();
});

module.exports = mongoose.model("UserProgress", userProgressSchema);
