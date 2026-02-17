# 🚀 Render Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.

## ✅ Pre-Deployment Checklist

### 1. Database Setup
- [ ] MongoDB Atlas account created
- [ ] Database cluster created
- [ ] Database user created with password
- [ ] Network Access: 0.0.0.0/0 (Allow from anywhere) added
- [ ] Connection string copied and ready

### 2. GitHub Repository
- [ ] Code pushed to GitHub
- [ ] Repository is public or Render has access
- [ ] All latest changes committed
- [ ] `.env` files are in `.gitignore`

### 3. Code Verification
- [ ] Backend runs locally (`npm run dev` in server folder)
- [ ] Frontend runs locally (`npm run dev` in client folder)
- [ ] Can login with test credentials
- [ ] Database connection works
- [ ] All features tested locally

### 4. Configuration Files
- [ ] `render.yaml` exists in root directory
- [ ] `server/package.json` has `"start": "node server.js"`
- [ ] `client/package.json` has `"build": "vite build"`
- [ ] `.gitignore` properly configured

---

## 🔧 Deployment Steps

### Step 1: Deploy Backend
- [ ] Go to [Render Dashboard](https://dashboard.render.com)
- [ ] Click "New" → "Blueprint" (or "Web Service")
- [ ] Connect GitHub repository
- [ ] Configure service name: `career-bridge-api`
- [ ] Set environment variables:
  - [ ] `NODE_ENV` = `production`
  - [ ] `PORT` = `10000`
  - [ ] `MONGODB_URI` = `your_connection_string`
  - [ ] `JWT_SECRET` = `generate_random_string`
  - [ ] `FRONTEND_URL` = (add after frontend deployment)
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete
- [ ] **Copy backend URL**: ___________________________

### Step 2: Test Backend
- [ ] Visit: `https://your-backend-url.onrender.com/api/health`
- [ ] Should see: `{"status":"OK","message":"Placement Cell API is running"}`

### Step 3: Deploy Frontend
- [ ] Click "New" → "Static Site"
- [ ] Connect same GitHub repository
- [ ] Configure service name: `career-bridge-frontend`
- [ ] Set build command: `npm install && npm run build`
- [ ] Set publish directory: `dist`
- [ ] Set root directory: `client`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
- [ ] Click "Create Static Site"
- [ ] Wait for deployment to complete
- [ ] **Copy frontend URL**: ___________________________

### Step 4: Update Backend CORS
- [ ] Go back to backend service settings
- [ ] Update `FRONTEND_URL` environment variable
- [ ] Set to your frontend URL (e.g., `https://career-bridge-frontend.onrender.com`)
- [ ] Save changes (will trigger redeploy)

---

## ✅ Post-Deployment Testing

### Test Authentication
- [ ] Visit your frontend URL
- [ ] Try logging in as Student: `student@test.com` / `password123`
- [ ] Dashboard loads correctly
- [ ] Try logging out
- [ ] Try logging in as Recruiter: `recruiter@test.com` / `password123`
- [ ] Try logging in as Admin: `admin@test.com` / `password123`

### Test Core Features
- [ ] **Student**: View jobs, apply to job, view applications
- [ ] **Recruiter**: Post job, view applicants, schedule interview
- [ ] **Admin**: View users, manage content, view analytics

### Test API Endpoints
- [ ] Health check works
- [ ] Authentication works
- [ ] Data loads from database
- [ ] File uploads work (resume upload)
- [ ] No CORS errors in browser console

---

## 🐛 Troubleshooting

### If Backend Won't Start
1. Check Render logs for errors
2. Verify MongoDB connection string
3. Ensure all environment variables are set
4. Check that MongoDB IP whitelist includes 0.0.0.0/0

### If Frontend Shows Errors
1. Check browser console for errors
2. Verify `VITE_API_URL` is correct
3. Test backend health endpoint directly
4. Check for CORS errors

### If CORS Errors Appear
1. Verify `FRONTEND_URL` is set in backend
2. Ensure URL matches exactly (no trailing slash)
3. Check backend logs for CORS-related messages

---

## 📝 Environment Variables Reference

### Backend (`career-bridge-api`)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_very_long_random_secret_string_here
FRONTEND_URL=https://career-bridge-frontend.onrender.com
```

### Frontend (`career-bridge-frontend`)
```
VITE_API_URL=https://career-bridge-api.onrender.com/api
```

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Backend health check returns OK
- ✅ Frontend loads without errors
- ✅ Can login with all three user types
- ✅ Dashboard displays correctly
- ✅ Can perform key actions (view jobs, apply, etc.)
- ✅ No console errors
- ✅ API calls work correctly

---

## 📊 Your Deployment URLs

**Frontend**: ___________________________

**Backend**: ___________________________

**API Health**: ___________________________/api/health

---

## 🔄 Future Updates

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push origin master
```

Render will automatically detect and deploy changes.

---

**Good luck with your deployment! 🚀**
