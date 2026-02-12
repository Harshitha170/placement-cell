const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeUrl: {
        type: String,
        required: true
    },
    fileName: String,
    atsScore: {
        type: Number,
        min: 0,
        max: 100
    },
    extractedText: String,
    keywords: {
        found: [String],
        missing: [String],
        suggestions: [String]
    },
    sections: {
        hasContactInfo: Boolean,
        hasEducation: Boolean,
        hasExperience: Boolean,
        hasSkills: Boolean,
        hasProjects: Boolean
    },
    formatting: {
        score: Number,
        issues: [String],
        suggestions: [String]
    },
    overallSuggestions: [String],
    analyzedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
