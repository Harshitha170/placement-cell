const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in minutes
        default: 60
    },
    meetingLink: String,
    meetingType: {
        type: String,
        enum: ['online', 'in-person', 'phone'],
        default: 'online'
    },
    location: String, // for offline interviews
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
        default: 'scheduled'
    },
    notes: String,
    feedback: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Interview', interviewSchema);
