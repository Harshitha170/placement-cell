const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/courses
// @desc    Get all courses with filters
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { jobRole, category, difficulty, provider, skills, search } = req.query;

        let query = {}; // Show all courses by default

        if (jobRole) {
            query.jobRoles = { $in: [jobRole] };
        }

        if (category) {
            query.category = category;
        }

        if (difficulty) {
            query.difficulty = difficulty;
        }

        if (provider) {
            query.provider = provider;
        }

        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim());
            query.skills = { $in: skillsArray };
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { skills: { $regex: search, $options: 'i' } }
            ];
        }

        const courses = await Course.find(query)
            .sort({ rating: -1, enrollments: -1 })
            .limit(50);

        res.json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching courses'
        });
    }
});

// @route   GET /api/courses/recommended
// @desc    Get recommended courses based on user's profile and job applications
// @access  Private (Student)
router.get('/recommended', protect, authorize('student'), async (req, res) => {
    try {
        const Application = require('../models/Application');
        const Job = require('../models/Job');

        // Get user's recent applications to understand their interests
        const applications = await Application.find({ studentId: req.user.id })
            .populate('jobId')
            .limit(10);

        // Extract job roles and required skills from applications
        const jobRoles = new Set();
        const skills = new Set();

        applications.forEach(app => {
            if (app.jobId) {
                jobRoles.add(app.jobId.title);
                if (app.jobId.requirements) {
                    app.jobId.requirements.split(',').forEach(skill => {
                        skills.add(skill.trim().toLowerCase());
                    });
                }
            }
        });

        // If user profile has skills, add those too
        if (req.user.studentProfile?.skills && Array.isArray(req.user.studentProfile.skills)) {
            req.user.studentProfile.skills.forEach(skill => skills.add(skill.toLowerCase()));
        }

        const jobRolesArray = Array.from(jobRoles);
        const skillsArray = Array.from(skills);

        // Find courses matching job roles or skills
        const query = {
            $or: []
        };

        if (jobRolesArray.length > 0) {
            query.$or.push({ jobRoles: { $in: jobRolesArray } });
        }

        if (skillsArray.length > 0) {
            query.$or.push({ skills: { $in: skillsArray } });
        }

        // Fallback to popular courses if no matches
        if (query.$or.length === 0) {
            delete query.$or;
        }

        const courses = await Course.find(query)
            .sort({ rating: -1, enrollments: -1 })
            .limit(20);

        res.json({
            success: true,
            count: courses.length,
            recommendedFor: {
                jobRoles: jobRolesArray,
                skills: skillsArray.slice(0, 10)
            },
            data: courses
        });
    } catch (error) {
        console.error('Error fetching recommended courses:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching recommended courses'
        });
    }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching course'
        });
    }
});

// @route   POST /api/courses
// @desc    Create new course
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const courseData = {
            ...req.body,
            createdBy: req.user.id
        };

        const course = await Course.create(courseData);

        res.status(201).json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating course'
        });
    }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating course'
        });
    }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        await course.deleteOne();

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting course'
        });
    }
});

// @route   POST /api/courses/bulk
// @desc    Bulk import courses
// @access  Private (Admin)
router.post('/bulk', protect, authorize('admin'), async (req, res) => {
    try {
        const { courses } = req.body;

        if (!Array.isArray(courses)) {
            return res.status(400).json({
                success: false,
                message: 'Courses must be an array'
            });
        }

        const coursesWithCreator = courses.map(course => ({
            ...course,
            createdBy: req.user.id
        }));

        const createdCourses = await Course.insertMany(coursesWithCreator);

        res.status(201).json({
            success: true,
            count: createdCourses.length,
            data: createdCourses
        });
    } catch (error) {
        console.error('Error bulk importing courses:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while bulk importing courses'
        });
    }
});

module.exports = router;
