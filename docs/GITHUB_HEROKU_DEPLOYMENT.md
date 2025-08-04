# GitHub to Heroku Deployment Guide

## Overview
Deploy your monorepo apps (unpuzzle-core and unpuzzle-m1) directly from GitHub to Heroku using GitHub Actions.

## Setup Steps

### 1. Create Heroku Apps
Create two Heroku apps using the Heroku Dashboard:
- One for unpuzzle-core
- One for unpuzzle-m1

### 2. GitHub Actions Setup

#### Set GitHub Secrets:
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `HEROKU_API_KEY`: Your Heroku API key (get from Heroku Account Settings)
- `HEROKU_EMAIL`: Your Heroku account email
- `HEROKU_CORE_APP_NAME`: Name of your unpuzzle-core Heroku app
- `HEROKU_M1_APP_NAME`: Name of your unpuzzle-m1 Heroku app

#### Get Your Heroku API Key:
1. Go to https://dashboard.heroku.com/account
2. Scroll to "API Key" section
3. Click "Reveal" and copy the key

### 3. Deployment Workflows

Two GitHub Actions workflows are configured:

#### a. Automatic Deployment (`.github/workflows/deploy-heroku.yml`)
- **Triggers**: Automatically on push to main/master branch
- **Smart Detection**: Only deploys apps that have changes
- **Path Filtering**: Monitors changes in `apps/unpuzzle-core/**` and `apps/unpuzzle-m1/**`

#### b. Manual Deployment (`.github/workflows/deploy-manual.yml`)
- **Trigger**: From GitHub Actions tab
- **Options**: 
  - Choose which app to deploy (unpuzzle-core, unpuzzle-m1, or both)
  - Select environment (production/staging)
- **Use Case**: When you need to redeploy without code changes

### 4. Deploy Your Apps

#### Automatic Deployment:
Simply push your changes to the main branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```
The workflow will automatically detect which apps have changes and deploy only those.

#### Manual Deployment:
1. Go to your GitHub repository
2. Click on the "Actions" tab
3. Select "Manual Deploy to Heroku" from the left sidebar
4. Click "Run workflow"
5. Select:
   - Which app to deploy
   - Environment (production/staging)
6. Click "Run workflow" button

### 5. Environment Variables

Set environment variables in Heroku Dashboard:

1. Go to your Heroku app
2. Navigate to "Settings" tab
3. Click "Reveal Config Vars"
4. Add all required environment variables from your `.env` file
5. **Important variables**:
   - `NODE_ENV=production`
   - Database connection strings
   - API keys
   - Any other app-specific variables

### 6. Important Files

Each app needs these files configured:

```
apps/unpuzzle-core/
├── package.json          # With "start" and "heroku-postbuild" scripts
├── Procfile             # Tells Heroku how to start the app
├── app.json             # Heroku app configuration
└── .slugignore          # Excludes unnecessary files from deployment

apps/unpuzzle-m1/
├── package.json          # With "start" and "heroku-postbuild" scripts
├── Procfile             # Tells Heroku how to start the app
├── app.json             # Heroku app configuration
└── .slugignore          # Excludes unnecessary files from deployment
```

### 7. Monitoring Deployments

#### GitHub Actions:
1. Go to "Actions" tab in your repository
2. Click on a workflow run to see details
3. Check logs for build and deployment status

#### Heroku Logs:
View application logs from Heroku Dashboard:
1. Go to your Heroku app
2. Click "More" → "View logs"

Or use Heroku CLI (if installed locally):
```bash
heroku logs --tail --app your-app-name
```

### 8. Troubleshooting

#### Build Failures:
- Ensure `typescript` is in dependencies (not devDependencies)
- Check that all required dependencies are listed
- Verify `heroku-postbuild` script runs the build command

#### Runtime Errors:
- Ensure PORT is read from environment: `process.env.PORT || 3001`
- Check all environment variables are set in Heroku
- Verify database connections are configured

#### Deployment Not Triggering:
- Check GitHub Actions tab for workflow runs
- Ensure secrets are properly configured
- Verify file changes are in the correct app directory

### 9. Rollback

If deployment causes issues, rollback from Heroku Dashboard:
1. Go to "Activity" tab in your Heroku app
2. Find the previous successful release
3. Click "Roll back to here"

## Notes

- The `.slugignore` files exclude unnecessary files (docs, uploads, source TS files) to reduce deployment size
- Uploaded files should use cloud storage (S3, Backblaze) not Heroku's ephemeral filesystem
- Each app deploys independently based on changes detected
- Manual deployment option available for forced redeployments