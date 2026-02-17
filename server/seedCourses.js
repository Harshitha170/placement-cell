const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected for seeding'))
    .catch(err => console.error('MongoDB connection error:', err));

const Course = require('./models/Course');

const sampleCourses = [
    // Programming & Software Engineering
    {
        title: 'CS50: Introduction to Computer Science',
        description: 'Harvard University\'s introduction to computer science and programming. Learn problem-solving, algorithms, data structures, and more.',
        provider: 'edX',
        url: 'https://www.edx.org/course/cs50s-introduction-to-computer-science',
        category: 'Programming',
        jobRoles: ['Software Engineer', 'Full Stack Developer', 'Backend Developer'],
        skills: ['C', 'Python', 'SQL', 'JavaScript', 'HTML', 'CSS', 'Algorithms', 'Data Structures'],
        difficulty: 'Beginner',
        duration: '12 weeks',
        rating: 4.9,
        isFree: true,
        enrollments: 4500000
    },
    {
        title: 'The Complete JavaScript Course',
        description: 'Master JavaScript from fundamentals to advanced topics. Build real-world projects and learn modern ES6+ features.',
        provider: 'Udemy',
        url: 'https://www.udemy.com/the-complete-javascript-course/',
        category: 'Web Development',
        jobRoles: ['Frontend Developer', 'Full Stack Developer', 'Web Developer'],
        skills: ['JavaScript', 'ES6', 'Async Programming', 'DOM', 'AJAX'],
        difficulty: 'Intermediate',
        duration: '69 hours',
        rating: 4.7,
        isFree: false,
        enrollments: 850000
    },
    {
        title: 'freeCodeCamp - Responsive Web Design',
        description: 'Learn HTML, CSS, Flexbox, Grid, and responsive design by building projects.',
        provider: 'FreeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/responsive-web-design/',
        category: 'Web Development',
        jobRoles: ['Frontend Developer', 'Web Developer', 'UI Developer'],
        skills: ['HTML', 'CSS', 'Flexbox', 'CSS Grid', 'Responsive Design'],
        difficulty: 'Beginner',
        duration: '300 hours',
        rating: 4.8,
        isFree: true,
        enrollments: 2000000
    },
    {
        title: 'React - The Complete Guide',
        description: 'Dive deep into React.js. Learn Hooks, Redux, Next.js, and build modern web applications.',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        category: 'Web Development',
        jobRoles: ['Frontend Developer', 'React Developer', 'Full Stack Developer'],
        skills: ['React', 'Redux', 'Hooks', 'Context API', 'Next.js'],
        difficulty: 'Intermediate',
        duration: '48 hours',
        rating: 4.6,
        isFree: false,
        enrollments: 720000
    },
    {
        title: 'Node.js, Express & MongoDB Bootcamp',
        description: 'Master Node.js by building a real-world RESTful API and web app with Express and MongoDB.',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/',
        category: 'Web Development',
        jobRoles: ['Backend Developer', 'Full Stack Developer', 'Node.js Developer'],
        skills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'Authentication'],
        difficulty: 'Intermediate',
        duration: '42 hours',
        rating: 4.7,
        isFree: false,
        enrollments: 450000
    },
    // Data Science & AI/ML
    {
        title: 'Machine Learning by Andrew Ng',
        description: 'The most popular machine learning course. Learn supervised learning, unsupervised learning, and best practices.',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/machine-learning',
        category: 'AI/ML',
        jobRoles: ['Data Scientist', 'Machine Learning Engineer', 'AI Engineer'],
        skills: ['Machine Learning', 'Python', 'Octave', 'Linear Regression', 'Neural Networks'],
        difficulty: 'Intermediate',
        duration: '11 weeks',
        rating: 4.9,
        isFree: true,
        enrollments: 5000000
    },
    {
        title: 'Python for Data Science and Machine Learning',
        description: 'Learn Python, NumPy, Pandas, Matplotlib, Scikit-Learn, and Machine Learning algorithms.',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/',
        category: 'Data Science',
        jobRoles: ['Data Scientist', 'Data Analyst', 'ML Engineer'],
        skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-Learn', 'Machine Learning'],
        difficulty: 'Intermediate',
        duration: '25 hours',
        rating: 4.6,
        isFree: false,
        enrollments: 680000
    },
    {
        title: 'Data Science Specialization',
        description: 'Johns Hopkins University course covering R programming, statistical inference, and practical machine learning.',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/jhu-data-science',
        category: 'Data Science',
        jobRoles: ['Data Scientist', 'Data Analyst', 'Research Analyst'],
        skills: ['R', 'Statistics', 'Machine Learning', 'Data Visualization', 'Git'],
        difficulty: 'Intermediate',
        duration: '11 months',
        rating: 4.5,
        isFree: true,
        enrollments: 1200000
    },
    {
        title: 'IBM Data Science Professional Certificate',
        description: 'Kickstart your career in data science & ML. Build data science skills, learn Python & SQL, analyze & visualize data, build machine learning models.',
        provider: 'Coursera',
        url: 'https://www.coursera.org/professional-certificates/ibm-data-science',
        category: 'Data Science',
        jobRoles: ['Data Scientist', 'Data Analyst'],
        skills: ['Data Science', 'Python', 'SQL', 'Data Analysis', 'Data Visualization'],
        difficulty: 'Beginner',
        duration: '5 months',
        rating: 4.6,
        isFree: true,
        enrollments: 1000000
    },
    // DevOps & Cloud
    {
        title: 'Docker and Kubernetes: The Complete Guide',
        description: 'Build, test, and deploy Docker applications with Kubernetes while learning production-style workflows.',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/',
        category: 'DevOps',
        jobRoles: ['DevOps Engineer', 'Cloud Engineer', 'Backend Developer'],
        skills: ['Docker', 'Kubernetes', 'CI/CD', 'Container Orchestration'],
        difficulty: 'Intermediate',
        duration: '22 hours',
        rating: 4.6,
        isFree: false,
        enrollments: 350000
    },
    {
        title: 'AWS Certified Solutions Architect',
        description: 'Prepare for AWS certification and learn to design distributed systems on AWS.',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/',
        category: 'Cloud Computing',
        jobRoles: ['Cloud Engineer', 'Solutions Architect', 'DevOps Engineer'],
        skills: ['AWS', 'EC2', 'S3', 'Lambda', 'Cloud Architecture'],
        difficulty: 'Intermediate',
        duration: '27 hours',
        rating: 4.7,
        isFree: false,
        enrollments: 920000
    },
    // Interview Prep
    {
        title: 'Data Structures and Algorithms',
        description: 'Master the fundamentals of data structures and algorithms for technical interviews.',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=RBSGKlAvoiM',
        category: 'Interview Prep',
        jobRoles: ['Software Engineer', 'Data Scientist', 'Backend Developer'],
        skills: ['Data Structures', 'Algorithms', 'Problem Solving'],
        difficulty: 'Intermediate',
        duration: '8 hours',
        rating: 4.8,
        isFree: true,
        enrollments: 3500000
    },
    {
        title: 'Cracking the Coding Interview',
        description: 'Learn proven techniques and practice coding interview questions from top tech companies.',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/master-the-coding-interview-data-structures-algorithms/',
        category: 'Interview Prep',
        jobRoles: ['Software Engineer', 'Full Stack Developer', 'Backend Developer'],
        skills: ['Problem Solving', 'Algorithms', 'Data Structures', 'Interview Skills'],
        difficulty: 'Intermediate',
        duration: '19 hours',
        rating: 4.6,
        isFree: false,
        enrollments: 550000
    },
    {
        title: 'System Design Interview Preparation',
        description: 'Learn to design scalable systems for senior engineer and architect interviews.',
        provider: 'YouTube',
        url: 'https://www.youtube.com/c/SystemDesignInterview',
        category: 'Interview Prep',
        jobRoles: ['Senior Software Engineer', 'Solutions Architect', 'Tech Lead'],
        skills: ['System Design', 'Scalability', 'Architecture', 'Distributed Systems'],
        difficulty: 'Advanced',
        duration: 'Self-paced',
        rating: 4.7,
        isFree: true,
        enrollments: 1500000
    },
    // Mobile Development
    {
        title: 'The Complete React Native Course',
        description: 'Build iOS and Android apps with React Native. Learn navigation, Redux, and deploy to app stores.',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/the-complete-react-native-and-redux-course/',
        category: 'Mobile Development',
        jobRoles: ['Mobile Developer', 'React Native Developer', 'Full Stack Developer'],
        skills: ['React Native', 'Redux', 'iOS', 'Android', 'Mobile Development'],
        difficulty: 'Intermediate',
        duration: '30 hours',
        rating: 4.5,
        isFree: false,
        enrollments: 280000
    },
    {
        title: 'Android App Development for Beginners',
        description: 'Learn Android development with Kotlin. Build real apps and publish to Google Play Store.',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/android-app-development-with-kotlin/',
        category: 'Mobile Development',
        jobRoles: ['Android Developer', 'Mobile Developer'],
        skills: ['Android', 'Kotlin', 'Mobile Development', 'Firebase'],
        difficulty: 'Beginner',
        duration: '28 hours',
        rating: 4.6,
        isFree: false,
        enrollments: 320000
    },
    // Cybersecurity
    {
        title: 'Cybersecurity Fundamentals',
        description: 'Learn the basics of cybersecurity, network security, and ethical hacking.',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/cyber-security',
        category: 'Cybersecurity',
        jobRoles: ['Security Analyst', 'Cybersecurity Engineer', 'Penetration Tester'],
        skills: ['Network Security', 'Cryptography', 'Ethical Hacking', 'Security Tools'],
        difficulty: 'Intermediate',
        duration: '8 months',
        rating: 4.7,
        isFree: true,
        enrollments: 450000
    },
    {
        title: 'Google Cybersecurity Professional Certificate',
        description: 'Identify common risks, threats, and vulnerabilities, as well as the techniques to mitigate them.',
        provider: 'Coursera',
        url: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
        category: 'Cybersecurity',
        jobRoles: ['Cybersecurity Analyst', 'Security Analyst'],
        skills: ['Linux', 'SQL', 'Python', 'SIEM', 'IDS'],
        difficulty: 'Beginner',
        duration: '6 months',
        rating: 4.8,
        isFree: true,
        enrollments: 400000
    },
    // Soft Skills
    {
        title: 'Effective Communication Skills',
        description: 'Master communication skills for professional success, presentations, and teamwork.',
        provider: 'LinkedIn Learning',
        url: 'https://www.linkedin.com/learning/communicating-with-confidence',
        category: 'Soft Skills',
        jobRoles: ['All Roles'],
        skills: ['Communication', 'Presentation', 'Public Speaking', 'Team Collaboration'],
        difficulty: 'Beginner',
        duration: '2 hours',
        rating: 4.6,
        isFree: false,
        enrollments: 180000
    },
    {
        title: 'Time Management Fundamentals',
        description: 'Learn to prioritize tasks, manage your time effectively, and increase productivity.',
        provider: 'LinkedIn Learning',
        url: 'https://www.linkedin.com/learning/time-management-fundamentals',
        category: 'Soft Skills',
        jobRoles: ['All Roles'],
        skills: ['Time Management', 'Productivity', 'Planning', 'Organization'],
        difficulty: 'Beginner',
        duration: '1.5 hours',
        rating: 4.5,
        isFree: false,
        enrollments: 250000
    },
    {
        title: 'Git and GitHub for Beginners',
        description: 'Learn version control with Git and collaborate on projects using GitHub.',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
        category: 'Programming',
        jobRoles: ['Software Engineer', 'Full Stack Developer', 'DevOps Engineer'],
        skills: ['Git', 'GitHub', 'Version Control', 'Collaboration'],
        difficulty: 'Beginner',
        duration: '1 hour',
        rating: 4.8,
        isFree: true,
        enrollments: 5000000
    },
    {
        title: 'SQL for Data Analysis',
        description: 'Master SQL queries, joins, aggregations, and window functions for data analysis.',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/the-complete-sql-bootcamp/',
        category: 'Data Science',
        jobRoles: ['Data Analyst', 'Data Scientist', 'Backend Developer'],
        skills: ['SQL', 'Database', 'PostgreSQL', 'Data Analysis'],
        difficulty: 'Beginner',
        duration: '9 hours',
        rating: 4.7,
        isFree: false,
        enrollments: 670000
    },
    // More Coursera Specifics (Fetch Simulation)
    {
        title: 'Meta Front-End Developer Professional Certificate',
        description: 'Launch your career as a front-end developer. Build job-ready skills for an in-demand career.',
        provider: 'Coursera',
        url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
        category: 'Web Development',
        jobRoles: ['Frontend Developer', 'Web Developer'],
        skills: ['React', 'JavaScript', 'HTML', 'CSS', 'UI/UX'],
        difficulty: 'Beginner',
        duration: '7 months',
        rating: 4.7,
        isFree: true,
        enrollments: 350000
    },
    {
        title: 'Meta Back-End Developer Professional Certificate',
        description: 'Launch your career as a back-end developer. Build job-ready skills for an in-demand career.',
        provider: 'Coursera',
        url: 'https://www.coursera.org/professional-certificates/meta-back-end-developer',
        category: 'Web Development',
        jobRoles: ['Backend Developer', 'Software Engineer'],
        skills: ['Python', 'Django', 'APIs', 'Databases', 'Cloud Computing'],
        difficulty: 'Beginner',
        duration: '8 months',
        rating: 4.7,
        isFree: true,
        enrollments: 200000
    }
];

async function seedCourses() {
    try {
        // Clear existing courses
        await Course.deleteMany({});
        console.log('Cleared existing courses');

        // Insert sample courses
        const courses = await Course.insertMany(sampleCourses);
        console.log(`✅ Successfully seeded ${courses.length} courses`);

        // Show summary
        const categories = await Course.distinct('category');
        console.log('\nCourses by category:');
        for (const category of categories) {
            const count = await Course.countDocuments({ category });
            console.log(`  ${category}: ${count} courses`);
        }

        const freeCount = await Course.countDocuments({ isFree: true });
        console.log(`\nFree courses: ${freeCount}/${courses.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding courses:', error);
        process.exit(1);
    }
}

seedCourses();
