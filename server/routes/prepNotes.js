const express = require('express');
const router = express.Router();
const PrepNote = require('../models/PrepNote');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/prep-notes
// @desc    Get all prep notes with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { company, category, difficulty, search } = req.query;

        let query = {};

        if (company) {
            query.company = { $regex: company, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        if (difficulty) {
            query.difficulty = difficulty;
        }

        if (search) {
            query.$or = [
                { topic: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const prepNotes = await PrepNote.find(query)
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.json(prepNotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/prep-notes/:id
// @desc    Get single prep note
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const prepNote = await PrepNote.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!prepNote) {
            return res.status(404).json({ message: 'Prep note not found' });
        }

        res.json(prepNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/prep-notes
// @desc    Create a new prep note
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const prepNote = await PrepNote.create({
            ...req.body,
            createdBy: req.user._id
        });

        res.status(201).json(prepNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/prep-notes/:id
// @desc    Update a prep note
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const prepNote = await PrepNote.findById(req.params.id);

        if (!prepNote) {
            return res.status(404).json({ message: 'Prep note not found' });
        }

        const updatedPrepNote = await PrepNote.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        res.json(updatedPrepNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/prep-notes/:id
// @desc    Delete a prep note
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const prepNote = await PrepNote.findById(req.params.id);

        if (!prepNote) {
            return res.status(404).json({ message: 'Prep note not found' });
        }

        await PrepNote.findByIdAndDelete(req.params.id);

        res.json({ message: 'Prep note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/prep-notes/companies/list
// @desc    Get list of unique companies
// @access  Public
router.get('/companies/list', async (req, res) => {
    try {
        const companies = await PrepNote.distinct('company');
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
