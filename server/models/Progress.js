const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    applicationStats: {
        totalApplications: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
        shortlisted: { type: Number, default: 0 },
        rejected: { type: Number, default: 0 },
        offered: { type: Number, default: 0 },
        successRate: { type: Number, default: 0 } // percentage
    },
    interviewStats: {
        totalInterviews: { type: Number, default: 0 },
        scheduled: { type: Number, default: 0 },
        completed: { type: Number, default: 0 },
        cleared: { type: Number, default: 0 },
        failed: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 }
    },
    mockInterviewStats: {
        totalMocks: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        bestScore: { type: Number, default: 0 },
        improvementRate: { type: Number, default: 0 }
    },
    skillDevelopment: {
        coursesEnrolled: { type: Number, default: 0 },
        coursesCompleted: { type: Number, default: 0 },
        skillsAcquired: [String],
        topSkills: [String]
    },
    resumeStats: {
        atsScore: { type: Number, default: 0 },
        lastUpdated: Date,
        totalVersions: { type: Number, default: 0 }
    },
    timeline: [{
        event: String, // 'Application', 'Interview', 'Mock Interview', 'Course Enrolled', etc.
        description: String,
        date: Date,
        status: String
    }],
    placementStatus: {
        type: String,
        enum: ['Not Started', 'Actively Searching', 'Interview Stage', 'Offer Received', 'Placed'],
        default: 'Not Started'
    },
    currentGoals: [{
        title: String,
        description: String,
        targetDate: Date,
        completed: { type: Boolean, default: false },
        progress: { type: Number, default: 0 } // 0-100
    }],
    weeklyActivity: [{
        week: String, // e.g., "2024-W01"
        applications: Number,
        interviews: Number,
        mockInterviews: Number,
        coursesStarted: Number
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update lastUpdated on save
progressSchema.pre('save', function (next) {
    this.lastUpdated = new Date();
    next();
});

module.exports = mongoose.model('Progress', progressSchema);
