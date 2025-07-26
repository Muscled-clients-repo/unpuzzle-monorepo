# Render Deployment - Simple Guide

## Quick Setup

Your monorepo is configured for Render deployment with the `render.yaml` file.

### Step 1: Go to Render
1. Visit [render.com](https://render.com)
2. Sign up/login with GitHub

### Step 2: Deploy
1. Click **"New +" → "Blueprint"**
2. Connect your GitHub repo: `Muscled-clients-repo/unpuzzle-mono-repo-frontend`
3. Render will automatically detect `render.yaml` and set up all 3 apps

### Step 3: Your Live URLs
After deployment:
- **Client**: `https://unpuzzle-client.onrender.com`
- **Instructor**: `https://unpuzzle-instructor.onrender.com/instructor`
- **Student**: `https://unpuzzle-student.onrender.com/student`

## Environment Variables

All environment variables are pre-configured in `render.yaml`:
- ✅ Clerk authentication keys
- ✅ API URLs  
- ✅ Server configurations

## Automatic Features
- ✅ Auto-deploy on GitHub push
- ✅ Free SSL certificates
- ✅ 750 hours/month per app
- ✅ Custom domain support

## Manual Setup (Alternative)

If Blueprint doesn't work, create each service manually:

### Client App:
```
Service Type: Web Service
Name: unpuzzle-client
Build Command: cd apps/client && npm install && npm run build
Start Command: cd apps/client && npm start
Root Directory: apps/client
```

### Instructor App:
```
Service Type: Web Service  
Name: unpuzzle-instructor
Build Command: cd apps/instructor && npm install && npm run build
Start Command: cd apps/instructor && npm start
Root Directory: apps/instructor
```

### Student App:
```
Service Type: Web Service
Name: unpuzzle-student
Build Command: cd apps/student && npm install && npm run build  
Start Command: cd apps/student && npm start
Root Directory: apps/student
```

## Done!
Your entire monorepo will be deployed with working authentication and routing.