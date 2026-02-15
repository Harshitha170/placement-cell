const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');

dotenv.config();

const courses = [
    {
        title: 'Complete Web Development Bootcamp',
        description: 'Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB, Web3 and DApps.',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
        category: 'Web Development',
        jobRoles: ['Frontend Developer', 'Full Stack Developer'],
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
        difficulty: 'Beginner',
        duration: '65 hours',
        rating: 4.8,
        isFree: false,
        enrollments: 850000
    },
    {
        title: 'Machine Learning Specialization',
        description: 'Build ML models with NumPy & scikit-learn, build & train neural networks with TensorFlow & Keras.',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/machine-learning-introduction',
        category: 'AI/ML',
        jobRoles: ['Machine Learning Engineer', 'Data Scientist'],
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'NumPy'],
        difficulty: 'Intermediate',
        duration: '3 months',
        rating: 4.9,
        isFree: true,
        enrollments: 120000
    },
    {
        title: 'CS50: Introduction to Computer Science',
        description: 'Introduction to the intellectual enterprises of computer science and the art of programming.',
        provider: 'edX',
        url: 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x',
        category: 'Programming',
        jobRoles: ['Software Engineer'],
        skills: ['C', 'Python', 'SQL', 'Algorithms', 'Data Structures'],
        difficulty: 'Beginner',
        duration: '12 weeks',
        rating: 4.8,
        isFree: true,
        enrollments: 4500000
    },
    {
        title: 'React - The Complete Guide',
        description: 'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        category: 'Web Development',
        jobRoles: ['Frontend Developer'],
        skills: ['React', 'Redux', 'JavaScript', 'Next.js'],
        difficulty: 'Intermediate',
        duration: '48 hours',
        rating: 4.7,
        isFree: false,
        enrollments: 700000
    },
    {
        title: 'Google Data Analytics Professional Certificate',
        description: 'Get started in the high-growth field of data analytics with a professional certificate from Google.',
        provider: 'Coursera',
        url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
        category: 'Data Science',
        jobRoles: ['Data Analyst'],
        skills: ['Data Analysis', 'SQL', 'R', 'Tableau'],
        difficulty: 'Beginner',
        duration: '6 months',
        rating: 4.8,
        isFree: true,
        enrollments: 1600000
    },
    {
        title: 'System Design Interview Guide',
        description: 'Learn how to design large-scale systems. Prepare for the system design interview.',
        provider: 'YouTube',
        url: 'https://www.youtube.com/c/GauravSensei',
        category: 'Interview Prep',
        jobRoles: ['Software Engineer', 'System Architect'],
        skills: ['System Design', 'Scalability', 'Distributed Systems'],
        difficulty: 'Advanced',
        duration: '10 hours',
        rating: 4.9,
        isFree: true,
        enrollments: 500000
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Users
        await User.deleteMany({});
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = await User.insertMany([
            {
                name: 'Student User',
                email: 'student@test.com',
                password: hashedPassword,
                role: 'student',
                studentProfile: {
                    college: 'IIT Bombay',
                    cgpa: 8.5,
                    graduationYear: 2024,
                    branch: 'CSE',
                    skills: ['JavaScript', 'React', 'Node.js']
                }
            },
            {
                name: 'Recruiter User',
                email: 'recruiter@test.com',
                password: hashedPassword,
                role: 'recruiter',
                recruiterProfile: {
                    company: 'Google',
                    position: 'HR Manager',
                    companyWebsite: 'https://google.com'
                }
            },
            {
                name: 'Admin User',
                email: 'admin@test.com',
                password: hashedPassword,
                role: 'admin'
            }
        ]);
        console.log('Users seeded');

        // Courses
        await Course.deleteMany({});
        // Assign admin as creator for all dummy courses
        const adminUser = users.find(u => u.role === 'admin');
        const coursesWithCreator = courses.map(c => ({ ...c, createdBy: adminUser._id }));

        await Course.insertMany(coursesWithCreator);
        console.log('Courses seeded');

        console.log('Database seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
