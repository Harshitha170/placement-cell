const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { search, location, jobType, company } = req.query;

        let query = { status: 'active' };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { skills: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (jobType) {
            query.jobType = jobType;
        }

        if (company) {
            query.company = { $regex: company, $options: 'i' };
        }

        const jobs = await Job.find(query)
            .populate('recruiterId', 'name recruiterProfile.company')
            .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/jobs/:id
// @desc    Get single job
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('recruiterId', 'name email recruiterProfile');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Recruiter only)
router.post('/', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            recruiterId: req.user._id
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Recruiter - own jobs only)
router.put('/:id', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership
        if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this job' });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Recruiter - own jobs only)
router.delete('/:id', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership
        if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }

        await Job.findByIdAndDelete(req.params.id);

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/jobs/recruiter/my-jobs
// @desc    Get recruiter's jobs
// @access  Private (Recruiter only)
router.get('/recruiter/my-jobs', protect, authorize('recruiter'), async (req, res) => {
    try {
        const jobs = await Job.aggregate([
            { $match: { recruiterId: req.user._id } },
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'jobId',
                    as: 'applicants'
                }
            },
            {
                $addFields: {
                    applicantCount: { $size: '$applicants' }
                }
            },
            {
                $project: {
                    applicants: 0 // Don't return the full applicants array here
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
