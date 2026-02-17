const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
    sendApplicationConfirmation,
    sendStatusUpdate
} = require('../utils/emailService');


// @route   POST /api/applications
// @desc    Apply for a job with resume upload
// @access  Private (Student only)
router.post('/', protect, authorize('student'), upload.single('resume'), async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            jobId,
            studentId: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'Already applied to this job' });
        }

        // Use uploaded resume or fallback to profile resume
        const resumeUrl = req.file
            ? `/uploads/resumes/${req.file.filename}`
            : req.user.studentProfile?.resumeUrl;

        // Create application
        const application = await Application.create({
            jobId,
            studentId: req.user._id,
            coverLetter,
            resumeUrl
        });

        const populatedApplication = await Application.findById(application._id)
            .populate('jobId', 'title company')
            .populate('studentId', 'name email studentProfile');

        // Send Application Confirmation Email (Non-blocking)
        sendApplicationConfirmation(populatedApplication.studentId, populatedApplication.jobId).catch(console.error);

        res.status(201).json(populatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/applications/my-applications
// @desc    Get student's applications
// @access  Private (Student only)
router.get('/my-applications', protect, authorize('student'), async (req, res) => {
    try {
        const applications = await Application.find({ studentId: req.user._id })
            .populate('jobId', 'title company location salary jobType')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/applications/:id
// @desc    Get single application by ID
// @access  Private (Recruiter/Admin)
router.get('/:id', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId', 'title company location recruiterId')
            .populate('studentId', 'name email studentProfile');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check ownership if recruiter
        if (req.user.role === 'recruiter' && application.jobId.recruiterId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a job
// @access  Private (Recruiter - own jobs only)
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership
        if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({
            jobId: new mongoose.Types.ObjectId(req.params.jobId)
        })
            .populate('studentId', 'name email studentProfile')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/applications/recruiter/all
// @desc    Get all applications received for all jobs by recruiter
// @access  Private (Recruiter only)
router.get('/recruiter/all', protect, authorize('recruiter'), async (req, res) => {
    try {
        // Find jobs owned by recruiter
        const jobs = await Job.find({ recruiterId: req.user._id });
        const jobIds = jobs.map(job => job._id);

        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('studentId', 'name email studentProfile')
            .populate('jobId', 'title company')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error('Error fetching all recruiter applications:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private (Recruiter only)
router.put('/:id/status', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        const { status } = req.body;

        const application = await Application.findById(req.params.id)
            .populate('jobId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check ownership
        if (application.jobId.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        application.status = status;
        application.updatedAt = Date.now();
        await application.save();

        const updatedApplication = await Application.findById(application._id)
            .populate('jobId', 'title company')
            .populate('studentId', 'name email studentProfile');

        // Send Status Update Email (Non-blocking)
        if (status !== 'applied') { // Only notify if status changed from initial 'applied'
            sendStatusUpdate(
                updatedApplication.studentId,
                updatedApplication.jobId,
                status
            ).catch(console.error);
        }

        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/applications/stats
// @desc    Get application statistics
// @access  Private (Admin only)
router.get('/stats', protect, authorize('admin'), async (req, res) => {
    try {
        const totalApplications = await Application.countDocuments();
        const statusCounts = await Application.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            total: totalApplications,
            byStatus: statusCounts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/applications/admin/placements
// @desc    Get all hired applications (Placements)
// @access  Private (Admin only)
router.get('/admin/placements', protect, authorize('admin'), async (req, res) => {
    try {
        const placements = await Application.find({ status: 'hired' })
            .populate('studentId', 'name email studentProfile')
            .populate('jobId', 'title company')
            .sort({ updatedAt: -1 });

        res.json(placements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
