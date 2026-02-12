const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        required: true,
        enum: ['Coursera', 'Udemy', 'edX', 'YouTube', 'Khan Academy', 'FreeCodeCamp', 'Udacity', 'LinkedIn Learning', 'Other']
    },
    url: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Programming', 'Web Development', 'Data Science', 'AI/ML', 'DevOps', 'Mobile Development', 'Cloud Computing', 'Cybersecurity', 'Soft Skills', 'Interview Prep', 'Other']
    },
    jobRoles: [{
        type: String,
        trim: true
    }],
    skills: [{
        type: String,
        trim: true
    }],
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    duration: {
        type: String,
        default: 'Self-paced'
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    isFree: {
        type: Boolean,
        default: true
    },
    thumbnail: {
        type: String,
        default: ''
    },
    enrollments: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for efficient searching
courseSchema.index({ jobRoles: 1, category: 1, isFree: 1 });
courseSchema.index({ skills: 1 });

module.exports = mongoose.model('Course', courseSchema);
