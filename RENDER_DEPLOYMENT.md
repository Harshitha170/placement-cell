# 🚀 Render Deployment Guide for Career Bridge

This guide will walk you through deploying your Career Bridge application to Render.

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas** - Database connection string (already have this)

---

## 🗄️ Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Navigate to your cluster → **Network Access**
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **Confirm**
6. Go to **Database Access** and ensure you have a database user
7. Copy your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

---

## 📤 Step 2: Push Code to GitHub

If you haven't already pushed your latest code:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin master
```

---

## 🔧 Step 3: Deploy Backend to Render

### Option A: Using Render Blueprint (Automated) ✨ **RECOMMENDED**

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file
5. Configure environment variables:
   - **MONGODB_URI**: Your MongoDB Atlas connection string
   - **FRONTEND_URL**: Leave blank for now (will update after frontend deployment)
   - **VITE_API_URL**: Leave blank for now (will update after backend deployment)
6. Click **"Apply"**

### Option B: Manual Deployment

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `career-bridge-api`
   - **Region**: Oregon (US West)
   - **Branch**: `master`
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGODB_URI` = `your_mongodb_connection_string`
   - `JWT_SECRET` = `your_secure_random_string` (generate a strong random string)
   - `FRONTEND_URL` = (leave blank for now)

6. Click **"Create Web Service"**

7. Wait for deployment (5-10 minutes)

8. **Copy your backend URL** (e.g., `https://career-bridge-api.onrender.com`)

---

## 🎨 Step 4: Deploy Frontend to Render

### Option A: Static Site (Recommended for Free Plan)

1. In Render Dashboard, click **"New"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `career-bridge-frontend`
   - **Branch**: `master`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com/api`
   - (Replace with your actual backend URL from Step 3)

5. Click **"Create Static Site"**

6. Wait for deployment (5-10 minutes)

7. **Copy your frontend URL** (e.g., `https://career-bridge-frontend.onrender.com`)

### Option B: Web Service (Alternative)

1. Click **"New"** → **"Web Service"**
2. Configure:
   - **Name**: `career-bridge-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build && npm install -g serve`
   - **Start Command**: `serve -s dist -l 10000`
   - Add environment variable: `VITE_API_URL`

---

## 🔄 Step 5: Update Backend CORS Settings

1. Go back to your **Backend Service** in Render
2. Update the `FRONTEND_URL` environment variable:
   - `FRONTEND_URL` = `https://your-frontend-url.onrender.com`
3. Click **"Save Changes"**
4. The service will automatically redeploy

---

## ✅ Step 6: Verify Deployment

1. Open your frontend URL in a browser
2. Try logging in with test credentials:
   - **Student**: student@test.com / password123
   - **Recruiter**: recruiter@test.com / password123
   - **Admin**: admin@test.com / password123

3. Test key features:
   - User authentication
   - Job listings
   - Application submission
   - Dashboard access

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Server won't start
- Check logs in Render dashboard
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

**Problem**: CORS errors
- Verify `FRONTEND_URL` is set correctly in backend
- Check that frontend URL matches exactly (no trailing slash)

### Frontend Issues

**Problem**: API calls failing
- Verify `VITE_API_URL` is set correctly
- Check backend is running and healthy
- Test backend health endpoint: `https://your-backend-url.onrender.com/api/health`

**Problem**: Build fails
- Check build logs in Render dashboard
- Verify all dependencies are in `package.json`
- Try building locally first: `npm run build`

### Database Issues

**Problem**: Can't connect to MongoDB
- Verify IP whitelist includes 0.0.0.0/0
- Check database user credentials
- Ensure connection string is correct

---

## 📊 Important Notes

### Free Tier Limitations

- **Backend**: Spins down after 15 minutes of inactivity
- **First request**: May take 30-60 seconds to wake up
- **Database**: MongoDB Atlas free tier has 512MB storage limit

### Performance Tips

1. **Keep services active**: Visit your site regularly to prevent spin-down
2. **Upgrade if needed**: Consider paid plans for production use
3. **Monitor usage**: Check Render dashboard for metrics

---

## 🔐 Security Checklist

- ✅ MongoDB IP whitelist configured
- ✅ Strong JWT_SECRET generated
- ✅ Environment variables set (not hardcoded)
- ✅ CORS properly configured
- ✅ .env files in .gitignore

---

## 🌐 Your Deployed URLs

After deployment, you'll have:

- **Frontend**: `https://career-bridge-frontend.onrender.com`
- **Backend API**: `https://career-bridge-api.onrender.com`
- **API Health Check**: `https://career-bridge-api.onrender.com/api/health`

---

## 📝 Post-Deployment Tasks

1. **Update README.md** with live URLs
2. **Test all features** thoroughly
3. **Set up monitoring** (optional)
4. **Configure custom domain** (optional, requires paid plan)
5. **Enable auto-deploy** from GitHub (already enabled by default)

---

## 🔄 Updating Your Deployment

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push origin master
```

Render will automatically detect changes and redeploy both services.

---

## 💡 Tips for Success

1. **Test locally first**: Always test changes locally before pushing
2. **Check logs**: Use Render dashboard logs for debugging
3. **Monitor performance**: Keep an eye on response times
4. **Backup data**: Regularly backup your MongoDB database
5. **Use environment variables**: Never commit secrets to Git

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com

---

**Congratulations! Your Career Bridge application is now live! 🎉**
