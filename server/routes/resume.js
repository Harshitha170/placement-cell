const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const ResumeAnalysis = require('../models/ResumeAnalysis');
const User = require('../models/User');
const { analyzeResume } = require('../utils/atsScanner');
const { protect, authorize } = require('../middleware/authMiddleware');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/resumes');
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype) ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF and DOCX files are allowed'));
        }
    }
});

// @route   POST /api/resume/upload
// @desc    Upload and analyze resume
// @access  Private (Student only)
router.post('/upload', protect, authorize('student'), upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const fileType = req.file.mimetype;

        // Analyze resume
        const analysisResult = await analyzeResume(filePath, fileType);

        // Save analysis to database
        const resumeAnalysis = await ResumeAnalysis.create({
            userId: req.user._id,
            resumeUrl: `/uploads/resumes/${req.file.filename}`,
            fileName: req.file.originalname,
            ...analysisResult
        });

        // Update user's resume URL and sync extracted skills to profile for better recommendations
        const userUpdate = {
            'studentProfile.resumeUrl': `/uploads/resumes/${req.file.filename}`
        };

        // If skills were extracted, sync them to the profile
        if (analysisResult.skills && analysisResult.skills.length > 0) {
            userUpdate['studentProfile.skills'] = analysisResult.skills;
        }

        await User.findByIdAndUpdate(req.user._id, userUpdate);

        res.status(201).json(resumeAnalysis);
    } catch (error) {
        // Clean up uploaded file on error
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/resume/analysis/latest
// @desc    Get latest resume analysis for current user
// @access  Private (Student only)
router.get('/analysis/latest', protect, authorize('student'), async (req, res) => {
    try {
        const analysis = await ResumeAnalysis.findOne({ userId: req.user._id })
            .sort({ analyzedAt: -1 });

        if (!analysis) {
            return res.status(404).json({ message: 'No resume analysis found' });
        }

        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/resume/analysis/history
// @desc    Get all resume analyses for current user
// @access  Private (Student only)
router.get('/analysis/history', protect, authorize('student'), async (req, res) => {
    try {
        const analyses = await ResumeAnalysis.find({ userId: req.user._id })
            .sort({ analyzedAt: -1 });

        res.json(analyses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/resume/analysis/:id
// @desc    Get specific resume analysis
// @access  Private (Student only)
router.get('/analysis/:id', protect, authorize('student'), async (req, res) => {
    try {
        const analysis = await ResumeAnalysis.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }

        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
