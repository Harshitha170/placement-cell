const mongoose = require('mongoose');

const prepNoteSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        trim: true
    },
    topic: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['technical', 'hr', 'aptitude', 'coding', 'system_design', 'behavioral'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    content: {
        type: String,
        required: true
    },
    tips: [String],
    resources: [{
        title: String,
        url: String
    }],
    tags: [String],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for searching
prepNoteSchema.index({ company: 1, topic: 1, category: 1 });

module.exports = mongoose.model('PrepNote', prepNoteSchema);
