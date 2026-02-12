# Career Bridge 🌉

**Career Bridge** is a comprehensive MERN-based placement management platform connecting students with recruiters and streamlining the campus recruitment process.

![Career Bridge](client/public/hero.png)

## 🌟 Features

### For Students
- 🔍 **Job Search & Matching** - Find opportunities tailored to your skills
- 📄 **Smart Applications** - Upload custom resumes for each application
- 🤖 **AI Mock Interviews** - Practice with AI-powered interview simulations
- 📊 **ATS Resume Scanner** - Optimize your resume for applicant tracking systems
- 📚 **Interview Prep Notes** - Access curated preparation materials
- 📈 **Progress Tracking** - Monitor your application journey

### For Recruiters
- 📝 **Job Posting** - Create and manage job listings
- 👥 **Applicant Management** - View detailed candidate profiles
- 📥 **Resume Access** - Download and review applicant resumes
- 📅 **Interview Scheduling** - Schedule online, in-person, or phone interviews
- 🎯 **Status Tracking** - Manage application statuses

### For Admins
- 👤 **User Management** - Oversee students, recruiters, and admins
- 📖 **Content Management** - Create and manage prep notes
- 📊 **Analytics Dashboard** - Platform statistics and insights

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Tailwind CSS v4** - Styling with custom design system
- **Axios** - API requests
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

### Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/career-bridge.git
cd career-bridge
```

### Backend Setup
```bash
cd server
npm install

# Create .env file
echo "PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development" > .env

# Start server
npm run dev
```

### Frontend Setup
```bash
cd client
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

## 🌐 Access

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Deploy to production
- [Build Guide](BUILD_GUIDE.md) - Production build instructions
- [Features](FEATURES.md) - Detailed feature list

## 🎨 Design System

**Career Bridge** features a modern, vibrant design with:
- **Primary Color**: Blue (#2563eb)
- **Secondary Color**: Teal (#14b8a6)
- **Accent Color**: Violet (#8b5cf6)
- **Glassmorphism Effects** - Frosted glass navbar
- **Smooth Animations** - Hover effects and transitions
- **Responsive Design** - Mobile-first approach

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Protected API routes
- File upload validation
- CORS configuration

## 📱 Screenshots

### Home Page
Modern landing page with hero section and feature cards

### Student Dashboard
Track applications, interviews, and progress

### Recruiter Dashboard
Manage jobs, view applicants, schedule interviews

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for connecting talent with opportunity

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Vercel for frontend hosting
- Render for backend hosting
- All open-source contributors

---

**Career Bridge** - Building the bridge to your future career 🌉✨
