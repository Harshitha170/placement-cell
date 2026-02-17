const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    sendInterviewConfirmation,
    sendInterviewRescheduled,
    sendInterviewCancelled,
    sendInterviewFeedback
} = require('../utils/emailService');


// @route   POST /api/interviews
// @desc    Schedule an interview
// @access  Private (Recruiter only)
router.post('/', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        const { applicationId, scheduledDate, duration, meetingLink, meetingType, location, notes } = req.body;

        // Get application details
        const application = await Application.findById(applicationId)
            .populate('jobId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check ownership
        if (application.jobId.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Create interview
        const interview = await Interview.create({
            applicationId,
            studentId: application.studentId,
            recruiterId: req.user._id,
            jobId: application.jobId._id,
            scheduledDate,
            duration,
            meetingLink,
            meetingType,
            location,
            notes
        });

        // Update application status
        application.status = 'interview_scheduled';
        await application.save();

        const populatedInterview = await Interview.findById(interview._id)
            .populate('studentId', 'name email')
            .populate('jobId', 'title company')
            .populate('recruiterId', 'name email');

        // Send Email Notification (Non-blocking)
        sendInterviewConfirmation(
            populatedInterview.studentId,
            populatedInterview,
            populatedInterview.jobId,
            populatedInterview.recruiterId
        ).catch(err => console.error('Failed to send interview email:', err));

        res.status(201).json(populatedInterview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/interviews/my-interviews
// @desc    Get student's upcoming interviews
// @access  Private (Student only)
router.get('/my-interviews', protect, authorize('student'), async (req, res) => {
    try {
        const interviews = await Interview.find({
            studentId: req.user._id,
            status: { $in: ['scheduled', 'rescheduled'] }
        })
            .populate('jobId', 'title company')
            .populate('recruiterId', 'name email recruiterProfile.company')
            .sort({ scheduledDate: 1 });

        res.json(interviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/interviews/recruiter/scheduled
// @desc    Get recruiter's scheduled interviews
// @access  Private (Recruiter only)
router.get('/recruiter/scheduled', protect, authorize('recruiter'), async (req, res) => {
    try {
        const interviews = await Interview.find({
            recruiterId: req.user._id,
            status: { $in: ['scheduled', 'rescheduled'] }
        })
            .populate('studentId', 'name email studentProfile')
            .populate('jobId', 'title company')
            .sort({ scheduledDate: 1 });

        res.json(interviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/interviews/:id
// @desc    Update interview (reschedule)
// @access  Private (Recruiter only)
router.put('/:id', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Check ownership
        if (interview.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedInterview = await Interview.findByIdAndUpdate(
            req.params.id,
            { ...req.body, status: 'rescheduled' },
            { new: true, runValidators: true }
        )
            .populate('studentId', 'name email')
            .populate('jobId', 'title company');

        // Send Reschedule Email
        sendInterviewRescheduled(
            updatedInterview.studentId,
            updatedInterview,
            updatedInterview.jobId
        ).catch(console.error);

        res.json(updatedInterview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/interviews/:id/cancel
// @desc    Cancel interview
// @access  Private (Recruiter only)
router.put('/:id/cancel', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Check ownership
        if (interview.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        interview.status = 'cancelled';
        await interview.save();

        const populatedInterview = await Interview.findById(interview._id)
            .populate('studentId', 'name email')
            .populate('jobId', 'title company');

        // Send Cancellation Email
        await sendInterviewCancelled(
            populatedInterview.studentId,
            populatedInterview,
            populatedInterview.jobId
        );

        res.json({ message: 'Interview cancelled successfully', interview: populatedInterview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/interviews/:id/complete
// @desc    Mark interview as completed with feedback
// @access  Private (Recruiter only)
router.put('/:id/complete', protect, authorize('recruiter', 'admin'), async (req, res) => {
    try {
        const { feedback } = req.body;
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Check ownership
        if (interview.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        interview.status = 'completed';
        interview.feedback = feedback;
        await interview.save();

        const populatedInterview = await Interview.findById(interview._id)
            .populate('studentId', 'name email')
            .populate('jobId', 'title company');

        // Send Feedback Email
        await sendInterviewFeedback(
            populatedInterview.studentId,
            populatedInterview,
            populatedInterview.jobId
        );

        res.json(populatedInterview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
