const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['student', 'recruiter', 'admin'],
        default: 'student'
    },
    // Student-specific fields
    studentProfile: {
        phone: String,
        college: String,
        degree: String,
        branch: String,
        graduationYear: Number,
        cgpa: Number,
        skills: [String],
        resumeUrl: String,
        linkedinUrl: String,
        githubUrl: String
    },
    // Recruiter-specific fields
    recruiterProfile: {
        company: String,
        designation: String,
        phone: String,
        companyWebsite: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
