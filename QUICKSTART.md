# Quick Start Guide - Placement Cell Application

## 🚀 Quick Setup (5 minutes)

### Prerequisites Check
Make sure you have installed:
- ✅ Node.js (v16+): `node --version`
- ✅ MongoDB: `mongod --version`
- ✅ npm: `npm --version`

### Step 1: Start MongoDB
```bash
# Start MongoDB service
mongod
```
Keep this terminal window open.

### Step 2: Setup Backend
Open a new terminal in the project directory:

```bash
# Navigate to server directory
cd server

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

The server will start on `http://localhost:5000`

### Step 3: Seed Database with Sample Data (Optional but Recommended)
Open another terminal in the server directory:

```bash
# Seed sample courses
node seedCourses.js
```

This will add 20+ curated courses to your database for testing the course recommendation feature.

### Step 4: Setup Frontend
Open a new terminal in the project directory:

```bash
# Navigate to client directory
cd client

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### Step 5: Access the Application
Open your browser and visit: `http://localhost:5173`

## 🎯 Test the Application

### Create Test Users

1. **Student Account**
   - Go to Register
   - Fill in details
   - Select Role: **Student**
   - Register and Login

2. **Recruiter Account**
   - Register another account
   - Select Role: **Recruiter**

3. **Admin Account**
   - Register another account
   - Select Role: **Admin**

### Test Features as Student

1. **Browse Jobs**
   - Navigate to "Jobs"
   - Browse available positions
   - Apply to 2-3 jobs you're interested in

2. **ATS Resume Scanner**
   - Go to "ATS Scanner"
   - Upload your resume (PDF/DOCX)
   - Get instant ATS compatibility score
   - Review suggestions

3. **Course Recommendations**
   - Click on "Courses"
   - View "Recommended for You" (personalized based on your applications)
   - Browse "All Courses"
   - Filter by category, difficulty, provider
   - Click "Start Learning" to visit course

4. **Mock Interview**
   - Go to "Mock Interview"
   - Click "Start New Mock Interview"
   - Choose:
     - Job Role: Software Engineer
     - Category: Technical
     - Difficulty: Medium
   - Answer the 5 questions
   - Get detailed performance analysis with scores

5. **Progress Tracking**
   - Visit "Progress"
   - View your comprehensive dashboard
   - See application statistics
   - Check weekly activity chart
   - Set career goals
   - Get personalized recommendations

### Test Features as Recruiter

1. **Post a Job**
   - Go to "Post Job"
   - Fill in job details
   - Submit

2. **Manage Applications**
   - View applications for your jobs
   - Update application status
   - Schedule interviews

3. **Interview Management**
   - Go to "Interviews"
   - View scheduled interviews
   - Add feedback and ratings

### Test Features as Admin

1. **User Management**
   - Go to "Users"
   - View all registered users
   - Manage user accounts

2. **Prep Notes Management**
   - Go to "Prep Notes"
   - Create interview preparation notes
   - Categorize by company/topic

3. **View Analytics**
   - Check platform statistics
   - Monitor overall placement metrics

## 🔥 Key Features to Explore

### 1. Smart Course Recommendations
- The system analyzes your job applications
- Extracts required skills from job descriptions
- Recommends courses matching your career path
- Updates in real-time as you apply to more jobs

### 2. AI-Powered Mock Interviews
- Dynamic question selection based on role and difficulty
- Real-time scoring algorithm
- Detailed feedback on each answer
- Track improvement over multiple attempts
- Compare performance across different categories

### 3. Comprehensive Progress Analytics
- Auto-updates as you use the platform
- Visual charts showing weekly activity
- Success rate calculations
- Smart recommendations based on your patterns
- Goal tracking with progress indicators

## 📊 Sample Workflow

### Day 1: Setup Profile
1. Register as student
2. Upload resume and get ATS score
3. Set initial career goals

### Day 2-3: Apply to Jobs
1. Browse and apply to 5-10 jobs
2. Check recommended courses (now personalized!)
3. Enroll in 2-3 relevant courses

### Day 4-7: Interview Prep
1. Take 3-4 mock interviews
2. Review feedback and improve
3. Read prep notes for target companies

### Day 8+: Track Progress
1. Monitor application status
2. Check progress dashboard
3. Review recommendations
4. Attend scheduled interviews

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod
```

### Port Already in Use
```bash
# Kill the process using the port
# Backend (5000):
npx kill-port 5000

# Frontend (5173):
npx kill-port 5173
```

### Module Not Found
```bash
# Reinstall dependencies
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

### Courses Not Showing
```bash
# Reseed the database
cd server
node seedCourses.js
```

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Review API endpoints for backend integration
- Check browser console for frontend errors
- Check server terminal for backend errors

## 🎉 You're All Set!

Start exploring the features and see how the placement cell can help streamline your campus recruitment process!

Happy Coding! 🚀
