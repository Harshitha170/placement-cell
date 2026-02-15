const express = require('express');
const router = express.Router();
const MockInterview = require('../models/MockInterview');
const { protect, authorize } = require('../middleware/authMiddleware');

// Mock interview question bank based on job roles
const questionBank = {
    'Software Engineer': {
        Technical: [
            { question: 'Explain the concept of Big O notation and its importance.', maxDuration: 300 },
            { question: 'What is the difference between SQL and NoSQL databases?', maxDuration: 240 },
            { question: 'Describe the MVC architecture pattern.', maxDuration: 300 },
            { question: 'What are RESTful APIs and their principles?', maxDuration: 240 },
            { question: 'Explain the concept of polymorphism in OOP.', maxDuration: 240 }
        ],
        HR: [
            { question: 'Tell me about yourself and your career goals.', maxDuration: 180 },
            { question: 'Why do you want to work in software development?', maxDuration: 150 },
            { question: 'Describe a challenging project you worked on.', maxDuration: 240 },
            { question: 'Where do you see yourself in 5 years?', maxDuration: 120 },
            { question: 'What are your greatest strengths and weaknesses?', maxDuration: 180 }
        ]
    },
    'Data Scientist': {
        Technical: [
            { question: 'Explain the difference between supervised and unsupervised learning.', maxDuration: 300 },
            { question: 'What is overfitting and how do you prevent it?', maxDuration: 240 },
            { question: 'Describe the working of a Random Forest algorithm.', maxDuration: 300 },
            { question: 'What are the assumptions of linear regression?', maxDuration: 240 },
            { question: 'Explain PCA and its applications.', maxDuration: 300 }
        ],
        HR: [
            { question: 'Tell me about a data-driven decision you made.', maxDuration: 240 },
            { question: 'How do you communicate complex findings to non-technical stakeholders?', maxDuration: 180 },
            { question: 'Describe your data analysis workflow.', maxDuration: 240 },
            { question: 'What interests you most about data science?', maxDuration: 150 },
            { question: 'Tell me about a time you found an insight in data.', maxDuration: 240 }
        ]
    },
    'Frontend Developer': {
        Technical: [
            { question: 'What is the Virtual DOM in React?', maxDuration: 240 },
            { question: 'Explain the difference between flexbox and grid.', maxDuration: 240 },
            { question: 'What are React hooks and why are they useful?', maxDuration: 300 },
            { question: 'How do you optimize website performance?', maxDuration: 300 },
            { question: 'Explain the concept of responsive design.', maxDuration: 240 }
        ],
        HR: [
            { question: 'Show me your portfolio and walk through a project.', maxDuration: 300 },
            { question: 'How do you stay updated with frontend technologies?', maxDuration: 180 },
            { question: 'Describe a challenging UI/UX problem you solved.', maxDuration: 240 },
            { question: 'What makes a good user experience?', maxDuration: 180 },
            { question: 'Why frontend development?', maxDuration: 150 }
        ]
    },
    'Default': {
        Technical: [
            { question: 'Describe a technical problem you solved recently.', maxDuration: 300 },
            { question: 'What technologies are you most comfortable with?', maxDuration: 240 },
            { question: 'How do you approach learning new technologies?', maxDuration: 240 },
            { question: 'Explain a complex concept from your field in simple terms.', maxDuration: 300 },
            { question: 'What are some industry best practices you follow?', maxDuration: 240 }
        ],
        HR: [
            { question: 'Tell me about yourself.', maxDuration: 180 },
            { question: 'Why are you interested in this role?', maxDuration: 150 },
            { question: 'Describe a teamwork experience.', maxDuration: 240 },
            { question: 'How do you handle failure and criticism?', maxDuration: 180 },
            { question: 'What motivates you?', maxDuration: 150 }
        ],
        Behavioral: [
            { question: 'Tell me about a time you showed leadership.', maxDuration: 240 },
            { question: 'Describe a conflict you resolved.', maxDuration: 240 },
            { question: 'Give an example of when you went above and beyond.', maxDuration: 240 },
            { question: 'How do you prioritize tasks under pressure?', maxDuration: 180 },
            { question: 'Tell me about a mistake you made and what you learned.', maxDuration: 240 }
        ]
    }
};

// Helper function to get questions for a mock interview
function getQuestionsForMock(jobRole, category, difficulty) {
    const roleQuestions = questionBank[jobRole] || questionBank['Default'];
    const categoryQuestions = roleQuestions[category] || roleQuestions['Technical'];

    // Number of questions based on difficulty
    const questionCount = difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 5 : 7;

    // Randomly select questions
    const shuffled = [...categoryQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, questionCount).map(q => ({
        question: q.question,
        maxDuration: q.maxDuration,
        answer: '',
        actualDuration: 0,
        score: 0,
        feedback: ''
    }));
}

// @route   POST /api/mock-interviews/start
// @desc    Start a new mock interview
// @access  Private (Student)
router.post('/start', protect, authorize('student'), async (req, res) => {
    try {
        const { jobRole, difficulty, category } = req.body;

        if (!jobRole || !difficulty || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide jobRole, difficulty, and category'
            });
        }

        const questions = getQuestionsForMock(jobRole, category, difficulty);

        const mockInterview = await MockInterview.create({
            student: req.user.id,
            jobRole,
            difficulty,
            category,
            questions,
            status: 'In Progress'
        });

        res.status(201).json({
            success: true,
            data: mockInterview
        });
    } catch (error) {
        console.error('Error starting mock interview:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while starting mock interview'
        });
    }
});

// @route   PUT /api/mock-interviews/:id/answer
// @desc    Submit answer for a question
// @access  Private (Student)
router.put('/:id/answer', protect, authorize('student'), async (req, res) => {
    try {
        const { questionIndex, answer, duration } = req.body;

        const mockInterview = await MockInterview.findById(req.params.id);

        if (!mockInterview) {
            return res.status(404).json({
                success: false,
                message: 'Mock interview not found'
            });
        }

        // Verify ownership
        if (mockInterview.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (questionIndex < 0 || questionIndex >= mockInterview.questions.length) {
            return res.status(400).json({
                success: false,
                message: 'Invalid question index'
            });
        }

        // Update the specific question
        mockInterview.questions[questionIndex].answer = answer;
        mockInterview.questions[questionIndex].actualDuration = duration;

        // Simple scoring based on answer length and time taken
        const answerWords = answer.trim().split(/\s+/).length;
        const timeScore = duration <= mockInterview.questions[questionIndex].maxDuration ? 10 : 7;
        const lengthScore = answerWords >= 50 ? 10 : answerWords >= 30 ? 8 : answerWords >= 20 ? 6 : 4;

        mockInterview.questions[questionIndex].score = Math.round((timeScore + lengthScore) / 2);

        // Generate basic feedback
        if (answerWords < 20) {
            mockInterview.questions[questionIndex].feedback = 'Try to provide more detailed answers.';
        } else if (duration > mockInterview.questions[questionIndex].maxDuration * 1.5) {
            mockInterview.questions[questionIndex].feedback = 'Good answer, but try to be more concise.';
        } else {
            mockInterview.questions[questionIndex].feedback = 'Well explained! Good job.';
        }

        await mockInterview.save();

        res.json({
            success: true,
            data: mockInterview
        });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while submitting answer'
        });
    }
});

// @route   PUT /api/mock-interviews/:id/complete
// @desc    Complete mock interview and generate analysis
// @access  Private (Student)
router.put('/:id/complete', protect, authorize('student'), async (req, res) => {
    try {
        const mockInterview = await MockInterview.findById(req.params.id);

        if (!mockInterview) {
            return res.status(404).json({
                success: false,
                message: 'Mock interview not found'
            });
        }

        // Verify ownership
        if (mockInterview.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Calculate overall score
        const answeredQuestions = mockInterview.questions.filter(q => q.answer);
        const totalScore = answeredQuestions.reduce((sum, q) => sum + q.score, 0);
        const avgScore = answeredQuestions.length > 0 ? totalScore / answeredQuestions.length : 0;
        mockInterview.overallScore = Math.round((avgScore / 10) * 100);

        // Calculate total duration
        mockInterview.totalDuration = mockInterview.questions.reduce((sum, q) => sum + q.actualDuration, 0);

        // Generate analysis
        const scores = mockInterview.questions.map(q => q.score);
        const avgQuestionScore = scores.reduce((a, b) => a + b, 0) / scores.length;

        const strengths = [];
        const improvements = [];

        if (avgQuestionScore >= 8) {
            strengths.push('Strong understanding of concepts');
        }
        if (mockInterview.totalDuration / answeredQuestions.length < 180) {
            strengths.push('Concise and clear communication');
        }

        const longAnswers = mockInterview.questions.filter(q =>
            q.actualDuration > q.maxDuration
        ).length;

        if (longAnswers > mockInterview.questions.length / 2) {
            improvements.push('Work on being more concise in your answers');
        }

        const shortAnswers = mockInterview.questions.filter(q =>
            q.answer && q.answer.trim().split(/\s+/).length < 30
        ).length;

        if (shortAnswers > mockInterview.questions.length / 2) {
            improvements.push('Provide more detailed explanations');
        }

        mockInterview.strengths = strengths.length > 0 ? strengths : ['Good effort! Keep practicing.'];
        mockInterview.improvements = improvements.length > 0 ? improvements : ['Continue building on your strengths'];

        // Analysis report
        mockInterview.analysisReport = {
            communicationScore: Math.min(100, Math.round((1 - (longAnswers / mockInterview.questions.length)) * 100)),
            technicalScore: mockInterview.overallScore,
            confidenceScore: Math.round(Math.random() * 20 + 70), // Simulated
            clarityScore: Math.round(avgQuestionScore * 10),
            overallFeedback: mockInterview.overallScore >= 80
                ? 'Excellent performance! You demonstrated strong knowledge and communication skills.'
                : mockInterview.overallScore >= 60
                    ? 'Good effort! Focus on the improvement areas and keep practicing.'
                    : 'Keep practicing! Review the feedback for each question and work on the suggested improvements.'
        };

        mockInterview.status = 'Completed';
        mockInterview.completedAt = new Date();

        await mockInterview.save();

        res.json({
            success: true,
            data: mockInterview
        });
    } catch (error) {
        console.error('Error completing mock interview:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while completing mock interview'
        });
    }
});

// @route   GET /api/mock-interviews/my-interviews
// @desc    Get student's mock interviews
// @access  Private (Student)
router.get('/my-interviews', protect, authorize('student'), async (req, res) => {
    try {
        const mockInterviews = await MockInterview.find({ student: req.user.id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: mockInterviews.length,
            data: mockInterviews
        });
    } catch (error) {
        console.error('Error fetching mock interviews:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching mock interviews'
        });
    }
});

// @route   GET /api/mock-interviews/:id
// @desc    Get single mock interview
// @access  Private (Student)
router.get('/:id', protect, authorize('student'), async (req, res) => {
    try {
        const mockInterview = await MockInterview.findById(req.params.id);

        if (!mockInterview) {
            return res.status(404).json({
                success: false,
                message: 'Mock interview not found'
            });
        }

        // Verify ownership
        if (mockInterview.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        res.json({
            success: true,
            data: mockInterview
        });
    } catch (error) {
        console.error('Error fetching mock interview:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching mock interview'
        });
    }
});

// @route   GET /api/mock-interviews/stats/overview
// @desc    Get mock interview statistics
// @access  Private (Student)
router.get('/stats/overview', protect, authorize('student'), async (req, res) => {
    try {
        const mockInterviews = await MockInterview.find({
            student: req.user.id,
            status: 'Completed'
        });

        const totalMocks = mockInterviews.length;
        const avgScore = totalMocks > 0
            ? mockInterviews.reduce((sum, m) => sum + m.overallScore, 0) / totalMocks
            : 0;
        const bestScore = totalMocks > 0
            ? Math.max(...mockInterviews.map(m => m.overallScore))
            : 0;

        // Calculate improvement over time
        let improvementRate = 0;
        if (totalMocks >= 2) {
            const recent = mockInterviews.slice(0, Math.min(3, totalMocks));
            const older = mockInterviews.slice(-Math.min(3, totalMocks));
            const recentAvg = recent.reduce((sum, m) => sum + m.overallScore, 0) / recent.length;
            const olderAvg = older.reduce((sum, m) => sum + m.overallScore, 0) / older.length;
            improvementRate = ((recentAvg - olderAvg) / olderAvg) * 100;
        }

        res.json({
            success: true,
            data: {
                totalMocks,
                avgScore: Math.round(avgScore),
                bestScore,
                improvementRate: Math.round(improvementRate),
                recentMocks: mockInterviews.slice(0, 5)
            }
        });
    } catch (error) {
        console.error('Error fetching mock interview stats:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching stats'
        });
    }
});

// @route   DELETE /api/mock-interviews/:id
// @desc    Delete a mock interview session
// @access  Private (Student)
router.delete('/:id', protect, authorize('student'), async (req, res) => {
    try {
        const mockInterview = await MockInterview.findById(req.params.id);

        if (!mockInterview) {
            return res.status(404).json({
                success: false,
                message: 'Mock interview not found'
            });
        }

        // Verify ownership
        if (mockInterview.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        await mockInterview.deleteOne();

        res.json({
            success: true,
            message: 'Mock interview session deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting mock interview:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting mock interview'
        });
    }
});

module.exports = router;
