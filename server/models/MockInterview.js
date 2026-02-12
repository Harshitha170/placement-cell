const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobRole: {
        type: String,
        required: true,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    category: {
        type: String,
        enum: ['Technical', 'HR', 'Behavioral', 'Case Study', 'Mixed'],
        required: true
    },
    questions: [{
        question: String,
        answer: String,
        maxDuration: Number, // in seconds
        actualDuration: Number,
        score: Number, // 0-10
        feedback: String
    }],
    overallScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    strengths: [String],
    improvements: [String],
    status: {
        type: String,
        enum: ['In Progress', 'Completed', 'Abandoned'],
        default: 'In Progress'
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date,
    totalDuration: Number, // in seconds
    analysisReport: {
        communicationScore: Number,
        technicalScore: Number,
        confidenceScore: Number,
        clarityScore: Number,
        overallFeedback: String
    }
}, {
    timestamps: true
});

// Index for querying user's mock interviews
mockInterviewSchema.index({ student: 1, createdAt: -1 });

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
