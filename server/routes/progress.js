const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const MockInterview = require('../models/MockInterview');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { protect, authorize } = require('../middleware/authMiddleware');

// Helper function to calculate success rate
function calculateSuccessRate(stats) {
    const total = stats.totalApplications;
    if (total === 0) return 0;
    return Math.round(((stats.offered + stats.shortlisted) / total) * 100);
}

// Helper function to get week string (e.g., "2024-W01")
function getWeekString(date) {
    const d = new Date(date);
    const onejan = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return `${d.getFullYear()}-W${week.toString().padStart(2, '0')}`;
}

// @route   GET /api/progress/my-progress
// @desc    Get student's comprehensive progress data
// @access  Private (Student)
router.get('/my-progress', protect, authorize('student'), async (req, res) => {
    try {
        let progress = await Progress.findOne({ student: req.user.id });

        // If no progress exists, create one
        if (!progress) {
            progress = await Progress.create({
                student: req.user.id,
                placementStatus: 'Not Started'
            });
        }

        // Update with latest data
        await updateProgressData(req.user.id);

        // Fetch updated progress
        progress = await Progress.findOne({ student: req.user.id });

        res.json({
            success: true,
            data: progress
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching progress'
        });
    }
});

// @route   PUT /api/progress/update
// @desc    Manually trigger progress update
// @access  Private (Student)
router.put('/update', protect, authorize('student'), async (req, res) => {
    try {
        await updateProgressData(req.user.id);

        const progress = await Progress.findOne({ student: req.user.id });

        res.json({
            success: true,
            data: progress,
            message: 'Progress updated successfully'
        });
    } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating progress'
        });
    }
});

// @route   POST /api/progress/goals
// @desc    Add a new goal
// @access  Private (Student)
router.post('/goals', protect, authorize('student'), async (req, res) => {
    try {
        const { title, description, targetDate } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a goal title'
            });
        }

        let progress = await Progress.findOne({ student: req.user.id });

        if (!progress) {
            progress = await Progress.create({ student: req.user.id });
        }

        progress.currentGoals.push({
            title,
            description,
            targetDate,
            completed: false,
            progress: 0
        });

        await progress.save();

        res.json({
            success: true,
            data: progress
        });
    } catch (error) {
        console.error('Error adding goal:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding goal'
        });
    }
});

// @route   PUT /api/progress/goals/:goalId
// @desc    Update a goal
// @access  Private (Student)
router.put('/goals/:goalId', protect, authorize('student'), async (req, res) => {
    try {
        const progress = await Progress.findOne({ student: req.user.id });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'Progress not found'
            });
        }

        const goal = progress.currentGoals.id(req.params.goalId);

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: 'Goal not found'
            });
        }

        // Update goal fields
        Object.keys(req.body).forEach(key => {
            goal[key] = req.body[key];
        });

        await progress.save();

        res.json({
            success: true,
            data: progress
        });
    } catch (error) {
        console.error('Error updating goal:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating goal'
        });
    }
});

// @route   DELETE /api/progress/goals/:goalId
// @desc    Delete a goal
// @access  Private (Student)
router.delete('/goals/:goalId', protect, authorize('student'), async (req, res) => {
    try {
        const progress = await Progress.findOne({ student: req.user.id });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'Progress not found'
            });
        }

        progress.currentGoals.pull(req.params.goalId);
        await progress.save();

        res.json({
            success: true,
            data: progress
        });
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting goal'
        });
    }
});

// @route   GET /api/progress/analytics
// @desc    Get detailed analytics and insights
// @access  Private (Student)
router.get('/analytics', protect, authorize('student'), async (req, res) => {
    try {
        await updateProgressData(req.user.id);

        const progress = await Progress.findOne({ student: req.user.id });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'Progress not found'
            });
        }

        // Calculate insights
        const insights = {
            applicationTrend: calculateApplicationTrend(progress.weeklyActivity),
            interviewConversionRate: calculateInterviewConversionRate(progress),
            skillGaps: await identifySkillGaps(req.user.id),
            recommendations: generateRecommendations(progress),
            performanceScore: calculateOverallPerformanceScore(progress)
        };

        res.json({
            success: true,
            data: {
                progress,
                insights
            }
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching analytics'
        });
    }
});

// @route   GET /api/progress/timeline
// @desc    Get detailed timeline of all activities
// @access  Private (Student)
router.get('/timeline', protect, authorize('student'), async (req, res) => {
    try {
        const progress = await Progress.findOne({ student: req.user.id });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'Progress not found'
            });
        }

        // Sort timeline by date (most recent first)
        const timeline = progress.timeline.sort((a, b) => b.date - a.date);

        res.json({
            success: true,
            data: timeline
        });
    } catch (error) {
        console.error('Error fetching timeline:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching timeline'
        });
    }
});

// Helper function to update progress data
async function updateProgressData(studentId) {
    let progress = await Progress.findOne({ student: studentId });

    if (!progress) {
        progress = new Progress({ student: studentId });
    }

    // Update application stats
    const applications = await Application.find({ student: studentId });
    progress.applicationStats.totalApplications = applications.length;
    progress.applicationStats.pending = applications.filter(a => a.status === 'Pending').length;
    progress.applicationStats.shortlisted = applications.filter(a => a.status === 'Shortlisted').length;
    progress.applicationStats.rejected = applications.filter(a => a.status === 'Rejected').length;
    progress.applicationStats.offered = applications.filter(a => a.status === 'Offered').length;
    progress.applicationStats.successRate = calculateSuccessRate(progress.applicationStats);

    // Update interview stats
    const interviews = await Interview.find({ student: studentId });
    progress.interviewStats.totalInterviews = interviews.length;
    progress.interviewStats.scheduled = interviews.filter(i => i.status === 'Scheduled').length;
    progress.interviewStats.completed = interviews.filter(i => i.status === 'Completed').length;
    progress.interviewStats.cleared = interviews.filter(i => i.feedback && i.feedback.result === 'Selected').length;
    progress.interviewStats.failed = interviews.filter(i => i.feedback && i.feedback.result === 'Rejected').length;

    // Calculate average interview score
    const completedWithFeedback = interviews.filter(i => i.feedback && i.feedback.rating);
    if (completedWithFeedback.length > 0) {
        const totalRating = completedWithFeedback.reduce((sum, i) => sum + i.feedback.rating, 0);
        progress.interviewStats.averageScore = Math.round((totalRating / completedWithFeedback.length / 5) * 100);
    }

    // Update mock interview stats
    const mockInterviews = await MockInterview.find({
        student: studentId,
        status: 'Completed'
    });

    progress.mockInterviewStats.totalMocks = mockInterviews.length;
    if (mockInterviews.length > 0) {
        const totalScore = mockInterviews.reduce((sum, m) => sum + m.overallScore, 0);
        progress.mockInterviewStats.averageScore = Math.round(totalScore / mockInterviews.length);
        progress.mockInterviewStats.bestScore = Math.max(...mockInterviews.map(m => m.overallScore));

        // Calculate improvement rate
        if (mockInterviews.length >= 2) {
            const sortedMocks = mockInterviews.sort((a, b) => a.createdAt - b.createdAt);
            const firstScore = sortedMocks[0].overallScore;
            const lastScore = sortedMocks[sortedMocks.length - 1].overallScore;
            progress.mockInterviewStats.improvementRate = Math.round(((lastScore - firstScore) / firstScore) * 100);
        }
    }

    // Update resume stats
    const latestResume = await ResumeAnalysis.findOne({ student: studentId })
        .sort({ createdAt: -1 });

    if (latestResume) {
        progress.resumeStats.atsScore = latestResume.atsScore;
        progress.resumeStats.lastUpdated = latestResume.createdAt;
    }

    const resumeCount = await ResumeAnalysis.countDocuments({ student: studentId });
    progress.resumeStats.totalVersions = resumeCount;

    // Update weekly activity
    const currentWeek = getWeekString(new Date());
    let weekActivity = progress.weeklyActivity.find(w => w.week === currentWeek);

    if (!weekActivity) {
        weekActivity = {
            week: currentWeek,
            applications: 0,
            interviews: 0,
            mockInterviews: 0,
            coursesStarted: 0
        };
        progress.weeklyActivity.push(weekActivity);
    }

    // Count this week's activities
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    weekActivity.applications = await Application.countDocuments({
        student: studentId,
        createdAt: { $gte: weekStart }
    });

    weekActivity.interviews = await Interview.countDocuments({
        student: studentId,
        createdAt: { $gte: weekStart }
    });

    weekActivity.mockInterviews = await MockInterview.countDocuments({
        student: studentId,
        createdAt: { $gte: weekStart }
    });

    // Keep only last 12 weeks
    progress.weeklyActivity = progress.weeklyActivity.slice(-12);

    // Update placement status based on progress
    if (progress.applicationStats.offered > 0) {
        progress.placementStatus = 'Offer Received';
    } else if (progress.interviewStats.scheduled > 0) {
        progress.placementStatus = 'Interview Stage';
    } else if (progress.applicationStats.totalApplications > 0) {
        progress.placementStatus = 'Actively Searching';
    }

    // Update timeline
    // Add recent applications
    const recentApps = await Application.find({ student: studentId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('job');

    for (const app of recentApps) {
        const exists = progress.timeline.some(t =>
            t.event === 'Application' &&
            t.description.includes(app.job ? app.job.title : '')
        );

        if (!exists && app.job) {
            progress.timeline.push({
                event: 'Application',
                description: `Applied for ${app.job.title}`,
                date: app.createdAt,
                status: app.status
            });
        }
    }

    // Keep timeline to reasonable size (last 50 events)
    progress.timeline = progress.timeline
        .sort((a, b) => b.date - a.date)
        .slice(0, 50);

    await progress.save();
    return progress;
}

// Helper functions for analytics
function calculateApplicationTrend(weeklyActivity) {
    if (weeklyActivity.length < 2) return 'neutral';

    const recent = weeklyActivity.slice(-4);
    const older = weeklyActivity.slice(-8, -4);

    if (older.length === 0) return 'neutral';

    const recentAvg = recent.reduce((sum, w) => sum + w.applications, 0) / recent.length;
    const olderAvg = older.reduce((sum, w) => sum + w.applications, 0) / older.length;

    if (recentAvg > olderAvg * 1.2) return 'increasing';
    if (recentAvg < olderAvg * 0.8) return 'decreasing';
    return 'stable';
}

function calculateInterviewConversionRate(progress) {
    const apps = progress.applicationStats.totalApplications;
    const interviews = progress.interviewStats.totalInterviews;

    if (apps === 0) return 0;
    return Math.round((interviews / apps) * 100);
}

async function identifySkillGaps(studentId) {
    // This would analyze job applications vs user skills
    // Simplified version returns generic gaps
    return [
        'Consider improving communication skills',
        'Practice more data structures and algorithms',
        'Build projects to showcase your skills'
    ];
}

function generateRecommendations(progress) {
    const recommendations = [];

    if (progress.applicationStats.totalApplications < 10) {
        recommendations.push({
            type: 'action',
            priority: 'high',
            message: 'Apply to more jobs to increase your chances'
        });
    }

    if (progress.mockInterviewStats.totalMocks < 5) {
        recommendations.push({
            type: 'practice',
            priority: 'medium',
            message: 'Take more mock interviews to improve your performance'
        });
    }

    if (progress.resumeStats.atsScore < 70) {
        recommendations.push({
            type: 'improvement',
            priority: 'high',
            message: 'Improve your resume ATS score by adding relevant keywords'
        });
    }

    if (progress.applicationStats.successRate < 20) {
        recommendations.push({
            type: 'strategy',
            priority: 'medium',
            message: 'Consider tailoring your applications to match job requirements better'
        });
    }

    return recommendations;
}

function calculateOverallPerformanceScore(progress) {
    let score = 0;

    // Application activity (max 25 points)
    score += Math.min(25, progress.applicationStats.totalApplications * 2);

    // Success rate (max 25 points)
    score += Math.min(25, progress.applicationStats.successRate / 4);

    // Mock interview performance (max 25 points)
    score += Math.min(25, progress.mockInterviewStats.averageScore / 4);

    // Resume quality (max 25 points)
    score += Math.min(25, progress.resumeStats.atsScore / 4);

    return Math.round(score);
}

module.exports = router;
