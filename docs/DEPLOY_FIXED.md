# Career Bridge - Quick Deployment Steps

## ✅ Fixes Applied
- Fixed dynamic Tailwind classes in Login.jsx and Register.jsx
- Code committed to Git repository
- Ready for production deploy!

---

## 🚀 DEPLOY NOW (Step by Step)

### Step 1: Push to GitHub (5 minutes)

1. Create a new repository on GitHub:
   - Go to: https://github.com/new
   - Repository name: `career-bridge`
   - Keep it Public (or Private)
   - **DO NOT** initialize with README
   - Click "Create repository"

2. Push your code (run these commands):

```powershell
cd C:\Users\jhars\.gemini\antigravity\scratch\placement-cell

# Add your GitHub repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/career-bridge.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy Frontend to Vercel (FREE - 5 minutes)

**Option A: Using Vercel Website** (Recommended - Easiest)

1. Go to: https://vercel.com/
2. Click "Sign Up" or "Login" with GitHub
3. Click "Add New..." → "Project"
4. Import your `career-bridge` repository
5. Configure project:
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   ```
6. Add Environment Variable:
   ```
   Name: VITE_API_URL
   Value: (Leave blank for now, we'll add after backend is deployed)
   ```
7. Click "Deploy"
8. Wait 2-3 minutes
9. **Copy your Vercel URL** (example: `https://career-bridge.vercel.app`)

**Option B: Using Vercel CLI** (For advanced users)

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy frontend
cd client
vercel --prod

# Set environment variable (after backend is deployed)
vercel env add VITE_API_URL production
# Enter: https://your-backend-url.onrender.com/api
```

---

### Step 3: Deploy Backend to Render (FREE - 10 minutes)

1. Go to: https://render.com/
2. Click "Sign Up" or "Login" with GitHub
3. Click "New +" → "Web Service"
4. Connect your `career-bridge` repository
5. Configure:
   ```
   Name: career-bridge-api
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

6. Click "Advanced" and add Environment Variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://admin:admin123@cluster0.c9lnutk.mongodb.net/?appName=Cluster0
   JWT_SECRET=career_bridge_super_secret_jwt_key_production_2024
   NODE_ENV=production
   ```

7. Click "Create Web Service"
8. Wait 5-10 minutes for first deployment
9. **Copy your Render URL** (example: `https://career-bridge-api.onrender.com`)

---

### Step 4: Connect Frontend to Backend (2 minutes)

1. Go back to **Vercel Dashboard**
2. Select your `career-bridge` project
3. Go to "Settings" → "Environment Variables"
4. Add or Edit `VITE_API_URL`:
   ```
   Name: VITE_API_URL
   Value: https://career-bridge-api.onrender.com/api
   ```
5. Go to "Deployments" tab
6. Click "..." on latest deployment → "Redeploy"
7. Wait 2 minutes

---

### Step 5: Update CORS (IMPORTANT - 3 minutes)

Your backend needs to allow requests from your Vercel domain.

1. Open the project in your editor
2. Edit `server/server.js` and find the CORS configuration
3. Add your Vercel URL to the allowed origins:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://career-bridge.vercel.app',  // Add your actual Vercel URL here
  'https://career-bridge-YOURNAME.vercel.app'  // If it's different
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

4. Save and commit:
```powershell
git add server/server.js
git commit -m "Update CORS for production"
git push
```

5. Render will auto-deploy (wait 3 minutes)

---

## 🎉 YOU'RE LIVE!

Your Career Bridge is now deployed at:
- **Frontend**: `https://career-bridge.vercel.app` (or your custom URL)
- **Backend**: `https://career-bridge-api.onrender.com`

### Test Your Deployment:
1. Visit your Vercel URL
2. Click "Register"
3. Create a student account
4. Login and test features

---

## ⚠️ Important: Keep Backend Awake

Render free tier sleeps after 15 minutes of inactivity. First request takes ~30 seconds.

**Solution**: Use UptimeRobot (free) to ping your backend every 5 minutes:
1. Go to: https://uptimerobot.com/
2. Add monitor: `https://career-bridge-api.onrender.com/api/health`
3. Interval: 5 minutes

---

## 💰 Cost: $0/month

- Vercel: FREE (100GB bandwidth)
- Render: FREE (750 hours/month)
- MongoDB Atlas: FREE (512MB)

**Total: $0** 🎉

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Wait 30 seconds if backend was sleeping
- Check Render logs for errors
- Verify CORS includes your frontend URL

### "Images not loading"
- Ensure images are in `client/public/images/` folder
- Paths should be `/images/filename.png`

### "MongoDB error"
- Check MongoDB Atlas IP whitelist (should include `0.0.0.0/0`)
- Verify connection string in Render environment variables

---

## 📱 Share Your Link!

Once deployed, you can share:
`https://career-bridge.vercel.app`

**Need help?** Check the detailed guides or reach out!
