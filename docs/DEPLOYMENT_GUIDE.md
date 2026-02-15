# Career Bridge - Deployment Guide

## 🚀 Quick Deployment Overview

We'll deploy:
- **Frontend** → Vercel (Free, Fast, Easy)
- **Backend** → Render (Free tier available)
- **Database** → MongoDB Atlas (Already configured)

---

## 📦 Step 1: Prepare for Deployment

### A. Create a GitHub Repository

1. **Initialize Git** (if not already done):
```bash
cd C:\Users\jhars\.gemini\antigravity\scratch\placement-cell
git init
git add .
git commit -m "Initial commit - Career Bridge"
```

2. **Create a new repository** on GitHub:
   - Go to https://github.com/new
   - Name it: `career-bridge`
   - Don't initialize with README (we already have files)
   - Click "Create repository"

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/career-bridge.git
git branch -M main
git push -u origin main
```

---

## 🎨 Step 2: Deploy Frontend to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy Frontend**:
```bash
cd client
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **career-bridge**
- Directory? **.**
- Override settings? **N**

4. **Set Environment Variable**:
```bash
vercel env add VITE_API_URL
```
Enter: `https://your-backend-url.onrender.com/api` (we'll get this in Step 3)

5. **Deploy to Production**:
```bash
vercel --prod
```

### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
5. Click **Deploy**

---

## 🔧 Step 3: Deploy Backend to Render

### Using Render Dashboard

1. **Go to Render**: https://render.com/
2. **Sign up/Login** with GitHub
3. **Click "New +"** → **Web Service**
4. **Connect your repository**: `career-bridge`
5. **Configure**:
   - **Name**: `career-bridge-api`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable":
   
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here_change_this
   NODE_ENV=production
   ```

7. **Click "Create Web Service"**

8. **Wait for deployment** (5-10 minutes)

9. **Copy your backend URL**: `https://career-bridge-api.onrender.com`

---

## 🔄 Step 4: Update Frontend with Backend URL

1. **Update Vercel Environment Variable**:
```bash
cd client
vercel env add VITE_API_URL production
```
Enter: `https://career-bridge-api.onrender.com/api`

2. **Redeploy Frontend**:
```bash
vercel --prod
```

---

## 🔐 Step 5: Configure CORS on Backend

Update `server/server.js` to allow your frontend domain:

```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://career-bridge.vercel.app', // Your Vercel domain
  'https://your-custom-domain.com'    // If you have one
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the changes.

---

## 📁 Step 6: Handle File Uploads

For production file uploads, you have two options:

### Option A: Use Render Disk Storage (Temporary)
- Files persist during deployment
- Free tier: 512MB

### Option B: Use Cloud Storage (Recommended)
- AWS S3
- Cloudinary
- Google Cloud Storage

For now, Render's disk storage will work for testing.

---

## ✅ Step 7: Verify Deployment

1. **Visit your frontend URL**: `https://career-bridge.vercel.app`
2. **Test registration**: Create a new account
3. **Test login**: Sign in with your account
4. **Test features**: 
   - Browse jobs
   - Upload resume
   - Apply to jobs
   - Check if images load

---

## 🎯 Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://career-bridge.vercel.app`
- **Backend API**: `https://career-bridge-api.onrender.com`
- **Database**: MongoDB Atlas (already configured)

---

## 🐛 Troubleshooting

### Frontend not loading?
- Check Vercel build logs
- Verify `VITE_API_URL` environment variable
- Check browser console for errors

### Backend not responding?
- Check Render logs
- Verify MongoDB connection string
- Ensure JWT_SECRET is set
- Check CORS configuration

### Images not displaying?
- Ensure images are in `client/public/` folder
- Check image paths in code
- Verify Vercel deployed the public folder

---

## 🔄 Future Updates

To update your deployed app:

1. **Make changes locally**
2. **Commit and push to GitHub**:
```bash
git add .
git commit -m "Your update message"
git push
```

3. **Auto-deployment**:
   - Vercel: Auto-deploys on push to main
   - Render: Auto-deploys on push to main

---

## 💰 Cost Breakdown

- **Vercel**: FREE (100GB bandwidth/month)
- **Render**: FREE (750 hours/month, sleeps after 15min inactivity)
- **MongoDB Atlas**: FREE (512MB storage)

**Total Cost**: $0/month 🎉

---

## 🚀 Optional: Custom Domain

### Add Custom Domain to Vercel:
1. Go to your project settings
2. Click "Domains"
3. Add your domain (e.g., `careerbridge.com`)
4. Update DNS records as instructed

### Add Custom Domain to Render:
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/

---

**Ready to deploy? Follow the steps above and your Career Bridge will be live! 🌉✨**
