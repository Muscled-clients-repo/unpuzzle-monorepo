# GitHub to Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account
- Code pushed to GitHub repository

## Step-by-Step Deployment

### 1. **Push to GitHub**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial monorepo setup"

# Add remote origin (replace with your repo URL)
git remote add origin https://github.com/yourusername/unpuzzle-monorepo.git

# Push to GitHub
git push -u origin main
```

### 2. **Connect to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Select the repository you just pushed

### 3. **Configure Project Settings**

When importing, configure:

- **Framework Preset**: `Next.js`
- **Root Directory**: `./` (leave empty for root)
- **Build and Output Settings**:
  - Build Command: `pnpm turbo build`
  - Install Command: `pnpm install`
  - Output Directory: Leave empty (auto-detect)

### 4. **Environment Variables**

In Vercel dashboard → Project Settings → Environment Variables, add:

```env
# Required for all environments (Production, Preview, Development)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_API_URL=your_api_url

# Add other variables as needed
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### 5. **Deploy**

1. Click "Deploy" in Vercel
2. Vercel will automatically:
   - Install dependencies with `pnpm install`
   - Build all apps with `pnpm turbo build`
   - Deploy the built applications

### 6. **Automatic Deployments**

Once connected, Vercel will automatically:
- ✅ Deploy on every push to `main` branch
- ✅ Create preview deployments for Pull Requests
- ✅ Show build logs and deployment status
- ✅ Handle domain routing automatically

## Project Structure on Vercel

Your monorepo will be deployed as a single project with routing:

```
your-project.vercel.app/           → Client app (main)
your-project.vercel.app/instructor → Instructor app
your-project.vercel.app/student    → Student app
```

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all TypeScript errors are fixed
- Verify environment variables are set correctly

### 404 on Sub-paths
- Verify `basePath` is correctly set in next.config.js
- Check `vercel.json` routing configuration

### Environment Variables Not Working
- Make sure variables have `NEXT_PUBLIC_` prefix for client-side
- Redeploy after adding new environment variables

## Benefits of GitHub Deployment

1. **Automatic Deployments**: Push to deploy
2. **Preview Deployments**: Every PR gets a preview URL
3. **Version Control**: Full deployment history
4. **Collaboration**: Team can trigger deployments
5. **Zero Downtime**: Atomic deployments
6. **Rollback**: Easy to rollback to previous versions

## Workflow

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Vercel automatically deploys
# Check status at vercel.com/dashboard
```