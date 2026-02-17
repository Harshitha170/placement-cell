require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const interviewRoutes = require('./routes/interviews');
const prepNoteRoutes = require('./routes/prepNotes');
const resumeRoutes = require('./routes/resume');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const mockInterviewRoutes = require('./routes/mockInterviews');
const progressRoutes = require('./routes/progress');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Simplified CORS to ensure connectivity on Netlify
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded resumes)
app.use('/uploads', express.static('uploads'));

// Define the API Router
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/jobs', jobRoutes);
apiRouter.use('/applications', applicationRoutes);
apiRouter.use('/interviews', interviewRoutes);
apiRouter.use('/prep-notes', prepNoteRoutes);
apiRouter.use('/resume', resumeRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/courses', courseRoutes);
apiRouter.use('/mock-interviews', mockInterviewRoutes);
apiRouter.use('/progress', progressRoutes);

apiRouter.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Placement Cell API is running' });
});

// Dual mounting for Local and Netlify support
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5000;

// ONLY start the server if we are NOT on Netlify
if (!process.env.NETLIFY) {
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
} else {
    console.log('--- Running in Netlify Serverless Mode ---');
}

module.exports = app;
