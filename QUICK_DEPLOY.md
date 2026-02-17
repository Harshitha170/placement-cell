# 🚀 Quick Start: Deploy to Render

## Step 1: MongoDB Atlas Setup (5 minutes)
1. Go to MongoDB Atlas → Network Access
2. Add IP: **0.0.0.0/0** (Allow from anywhere)
3. Copy your connection string

## Step 2: Deploy to Render (10 minutes)

### Deploy Backend
1. Go to **https://dashboard.render.com**
2. Click **New** → **Blueprint**
3. Connect your GitHub repo: `https://github.com/Harshitha170/placement-cell`
4. Render will detect `render.yaml`
5. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate random string (e.g., use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
6. Click **Apply**

### Get Your URLs
After deployment completes:
- Backend: `https://career-bridge-api.onrender.com`
- Frontend: `https://career-bridge-frontend.onrender.com`

### Update CORS
1. Go to backend service settings
2. Add environment variable:
   - `FRONTEND_URL`: Your frontend URL
3. Go to frontend service settings  
4. Add environment variable:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`
5. Save (both will redeploy)

## Step 3: Test (2 minutes)
Visit your frontend URL and login:
- Student: `student@test.com` / `password123`
- Recruiter: `recruiter@test.com` / `password123`
- Admin: `admin@test.com` / `password123`

---

## 📚 Full Documentation
- **Detailed Guide**: See `RENDER_DEPLOYMENT.md`
- **Checklist**: See `DEPLOYMENT_CHECKLIST.md`

## 🆘 Troubleshooting
- **Backend won't start**: Check MongoDB connection string and IP whitelist
- **CORS errors**: Verify `FRONTEND_URL` matches your frontend URL exactly
- **Build fails**: Check Render logs for specific errors

---

**Total Time: ~15-20 minutes** ⏱️
