# Career Bridge - Project Structure

## 📁 Directory Organization

```
placement-cell/
├── 📄 README.md                    # Main project documentation
├── 📄 .gitignore                   # Git ignore rules
│
├── 📂 client/                      # Frontend React Application
│   ├── 📂 public/                  # Static assets
│   │   ├── 📂 images/              # Image assets
│   │   │   ├── login.png
│   │   │   ├── register.png
│   │   │   ├── register_female.png
│   │   │   └── register_v2.png
│   │   ├── hero.png
│   │   ├── login_side.png
│   │   └── vite.svg
│   │
│   ├── 📂 src/                     # Source code
│   │   ├── 📂 api/                 # API service layer
│   │   │   └── axios.js            # Axios configuration
│   │   │
│   │   ├── 📂 assets/              # React assets
│   │   │
│   │   ├── 📂 components/          # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── 📂 student/         # Student-specific components
│   │   │
│   │   ├── 📂 context/             # React Context
│   │   │   └── AuthContext.jsx    # Authentication context
│   │   │
│   │   ├── 📂 pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   │
│   │   │   ├── 📂 student/         # Student pages (10 pages)
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Jobs.jsx
│   │   │   │   ├── Applications.jsx
│   │   │   │   ├── Interviews.jsx
│   │   │   │   ├── MockInterview.jsx
│   │   │   │   ├── MockInterviewSession.jsx
│   │   │   │   ├── ATSScanner.jsx
│   │   │   │   ├── PrepNotes.jsx
│   │   │   │   ├── Courses.jsx
│   │   │   │   └── Progress.jsx
│   │   │   │
│   │   │   ├── 📂 recruiter/       # Recruiter pages (6 pages)
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── PostJob.jsx
│   │   │   │   ├── Applications.jsx
│   │   │   │   ├── JobApplicants.jsx
│   │   │   │   ├── ScheduleInterview.jsx
│   │   │   │   └── Interviews.jsx
│   │   │   │
│   │   │   └── 📂 admin/           # Admin pages (4 pages)
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Users.jsx
│   │   │       ├── PrepNotes.jsx
│   │   │       └── Placements.jsx
│   │   │
│   │   ├── App.jsx                 # Main App component
│   │   ├── App.css                 # App styles
│   │   ├── index.css               # Global styles with Tailwind
│   │   └── main.jsx                # Entry point
│   │
│   ├── .env                        # Environment variables
│   ├── .env.example                # Environment template
│   ├── package.json                # Dependencies
│   ├── tailwind.config.js          # Tailwind configuration
│   ├── vite.config.js              # Vite configuration
│   └── vercel.json                 # Vercel deployment config
│
├── 📂 server/                      # Backend Node.js/Express API
│   ├── 📂 config/                  # Configuration files
│   │   └── db.js                   # MongoDB connection
│   │
│   ├── 📂 middleware/              # Express middleware
│   │   ├── auth.js                 # Authentication middleware
│   │   └── upload.js               # File upload middleware (Multer)
│   │
│   ├── 📂 models/                  # Mongoose models (9 models)
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── Interview.js
│   │   ├── MockInterview.js
│   │   ├── Course.js
│   │   ├── PrepNote.js
│   │   ├── Progress.js
│   │   └── ResumeAnalysis.js
│   │
│   ├── 📂 routes/                  # API routes (10 route files)
│   │   ├── auth.js                 # Authentication routes
│   │   ├── users.js                # User management
│   │   ├── jobs.js                 # Job listings
│   │   ├── applications.js         # Job applications
│   │   ├── interviews.js           # Interview scheduling
│   │   ├── mockInterviews.js       # Mock interview system
│   │   ├── courses.js              # Course management
│   │   ├── prepNotes.js            # Prep notes
│   │   ├── progress.js             # Progress tracking
│   │   └── resume.js               # Resume/ATS scanning
│   │
│   ├── 📂 uploads/                 # Uploaded files (resumes)
│   │   └── resumes/                # Resume files
│   │
│   ├── 📂 utils/                   # Utility functions
│   │
│   ├── .env                        # Environment variables
│   ├── .env.example                # Environment template
│   ├── package.json                # Dependencies
│   ├── server.js                   # Main server file
│   ├── seed.js                     # Database seeding
│   ├── seedCourses.js              # Course data seeding
│   ├── test-db.js                  # Database test script
│   ├── test-dns.js                 # DNS test script
│   └── render.yaml                 # Render deployment config
│
├── 📂 docs/                        # Documentation (7 files)
│   ├── BUILD_GUIDE.md              # Production build guide
│   ├── DEPLOYMENT_GUIDE.md         # Full deployment instructions
│   ├── DEPLOY_FIXED.md             # Quick deploy guide (fixed version)
│   ├── DEPLOY_NOW.md               # Deploy now guide
│   ├── FEATURES.md                 # Detailed feature list
│   ├── FEATURE_UPDATE.md           # Feature updates log
│   └── QUICKSTART.md               # Quick start guide
│
└── 📂 scripts/                     # Utility scripts (2 files)
    ├── build-debug.js              # Build debugging script
    └── deploy.sh                   # Deployment shell script
```

---

## 📊 Project Statistics

### Frontend (Client)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4
- **Pages**: 24 total
  - Common: 4 (Home, Login, Register, Profile)
  - Student: 10 pages
  - Recruiter: 6 pages
  - Admin: 4 pages
- **Components**: Reusable UI components + role-specific
- **Context**: Authentication with JWT

### Backend (Server)
- **Framework**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Models**: 9 Mongoose schemas
- **Routes**: 10 API route files
- **Features**:
  - JWT Authentication
  - Role-based Access Control (RBAC)
  - File Upload (Multer)
  - Password Hashing (bcrypt)
  - CORS Configuration

### Documentation
- **7 comprehensive guides** covering:
  - Deployment (3 guides)
  - Features (2 guides)
  - Build process (1 guide)
  - Quick start (1 guide)

### Scripts
- **Build debugging** script
- **Deployment automation** script

---

## 🎯 Key Features by Module

### 👨‍🎓 Student Module
1. Dashboard - Overview & statistics
2. Job Search - Browse and filter jobs
3. Applications - Track application status
4. Mock Interviews - AI-powered practice
5. ATS Scanner - Resume optimization
6. Prep Notes - Study materials
7. Courses - Learning resources
8. Interviews - Scheduled interviews
9. Progress - Analytics dashboard

### 💼 Recruiter Module
1. Dashboard - Recruiter overview
2. Post Job - Create job listings
3. Applications - View all applications
4. Job Applicants - Detailed applicant view
5. Schedule Interview - Set up interviews
6. Interviews - Manage scheduled interviews

### 🛡️ Admin Module
1. Dashboard - System analytics
2. Users - User management
3. Prep Notes - Content management
4. Placements - Placement tracking

---

## 🔧 Technology Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS v4
- Axios
- Vite
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcryptjs
- Multer
- CORS

### Deployment
- Frontend: Vercel (Free)
- Backend: Render (Free)
- Database: MongoDB Atlas (Free)

---

## 📝 Environment Variables

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Server (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

---

## 🚀 Quick Start

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Start backend
cd server && npm run dev

# Start frontend (in new terminal)
cd client && npm run dev

# Access app
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## 📦 File Count Summary

- **Total Files**: 100+ files
- **React Components**: 24+ pages
- **API Routes**: 10 route files
- **Models**: 9 Mongoose models
- **Documentation**: 7 comprehensive guides
- **Images**: 7 image assets

---

## 🎨 Design System

- **Typography**: Bold, uppercase tracking
- **Colors**: Role-based theming
  - Student: Emerald/Teal
  - Recruiter: Indigo/Violet
  - Admin: Purple/Fuchsia
- **Components**: Cards, buttons, inputs, badges
- **Animations**: Hover effects, transitions, micro-interactions
- **Layout**: Responsive, mobile-first

---

## 📄 License

MIT License - See LICENSE file for details

---

**Career Bridge** - Building the bridge to your future career 🌉✨
