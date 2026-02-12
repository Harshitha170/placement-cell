# Career Bridge - Production Build Guide

## Application Overview
**Career Bridge** is a comprehensive MERN-based placement management platform with three user roles:
- **Students**: Job search, applications, interview prep, ATS scanner, mock interviews
- **Recruiters**: Job posting, applicant management, interview scheduling
- **Admins**: User management, prep notes management, platform oversight

## Rebranding Complete ✅
- Application renamed from "Placement Cell" to "Career Bridge"
- New vibrant UI with gradient colors (Blue, Teal, Violet)
- Premium glassmorphism effects on Navbar
- Professional hero images on Login and Home pages

## Build Instructions

### Development Mode (Currently Running)
Both servers are running in development mode:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:5000 (Express server with nodemon)

### Production Build

#### Frontend Build
```bash
cd client
npm run build
```

This creates an optimized production build in `client/dist/` directory.

#### Serving Production Build
After building, you can serve the production files using:

**Option 1: Using Vite Preview**
```bash
cd client
npm run preview
```

**Option 2: Using Express to Serve Static Files**
Update `server/server.js` to serve the built frontend:
```javascript
// Add after other middleware
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}
```

Then run:
```bash
cd server
NODE_ENV=production npm start
```

## Environment Variables

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
```

For production, update to your production API URL:
```
VITE_API_URL=https://your-api-domain.com/api
```

### Server (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

## Deployment Checklist

### Frontend
- [ ] Update `VITE_API_URL` to production API endpoint
- [ ] Run `npm run build` in client directory
- [ ] Upload `client/dist/` contents to hosting (Vercel, Netlify, etc.)
- [ ] Ensure images in `public/` folder are included

### Backend
- [ ] Set `NODE_ENV=production`
- [ ] Update MongoDB URI to production database
- [ ] Configure CORS to allow production frontend domain
- [ ] Set up file upload directory permissions
- [ ] Deploy to hosting (Heroku, Railway, AWS, etc.)

## Key Features Implemented

### Student Features
✅ Job browsing and search
✅ Per-application resume upload
✅ Application tracking
✅ Interview scheduling view
✅ Mock interview with AI
✅ ATS resume scanner
✅ Interview prep notes
✅ Progress tracking
✅ Course recommendations

### Recruiter Features
✅ Job posting
✅ View all applicants with full details
✅ Resume viewing and download
✅ Interview scheduling (Online/In-person/Phone)
✅ Application status management
✅ Interview management dashboard

### Admin Features
✅ User management
✅ Prep notes creation and management
✅ Platform statistics
✅ Role-based access control

## UI Enhancements
- **Color Palette**: Blue (Primary), Teal (Secondary), Violet (Accent)
- **Navbar**: Glassmorphism with sticky positioning, animated underlines
- **Cards**: Soft shadows with hover animations
- **Buttons**: Gradient backgrounds with scale effects
- **Forms**: Rounded inputs with focus rings
- **Images**: Professional hero images on Login and Home pages

## File Structure
```
placement-cell/
├── client/
│   ├── public/
│   │   ├── hero.png
│   │   ├── login_side.png
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── config/
│   ├── server.js
│   └── package.json
└── README.md
```

## Notes
- The application uses Tailwind CSS v4 with custom design tokens
- File uploads are stored in `server/uploads/resumes/`
- JWT authentication with role-based access control
- MongoDB for data persistence

## Support
For any build issues or deployment questions, refer to:
- Vite documentation: https://vitejs.dev/guide/build.html
- Express deployment: https://expressjs.com/en/advanced/best-practice-performance.html
