#!/bin/bash

echo "🌉 Career Bridge - Quick Deployment Script"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Career Bridge"
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Create a GitHub repository:"
echo "   - Go to: https://github.com/new"
echo "   - Name: career-bridge"
echo "   - Don't initialize with README"
echo ""
echo "2. Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/career-bridge.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy Frontend (Vercel):"
echo "   - Go to: https://vercel.com/new"
echo "   - Import your GitHub repo"
echo "   - Root Directory: client"
echo "   - Framework: Vite"
echo "   - Add env: VITE_API_URL"
echo ""
echo "4. Deploy Backend (Render):"
echo "   - Go to: https://render.com/"
echo "   - New Web Service"
echo "   - Root Directory: server"
echo "   - Add environment variables (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT_GUIDE.md"
echo ""
