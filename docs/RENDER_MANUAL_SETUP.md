# Render Manual Setup Guide

Since Render Blueprint isn't working with our render.yaml, deploy each app manually:

## Deploy Client App

1. **Go to Render Dashboard**
2. **Click "New +" → "Web Service"**
3. **Connect GitHub repo**: `Muscled-clients-repo/unpuzzle-mono-repo-frontend`
4. **Configure:**
   ```
   Name: unpuzzle-client
   Environment: Node
   Root Directory: apps/client
   Build Command: npm ci && npm run build
   Start Command: npm start
   ```
5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://dev.nazmulcodes.org
   ```

## Deploy Instructor App

1. **Click "New +" → "Web Service"**
2. **Same repo**: `Muscled-clients-repo/unpuzzle-mono-repo-frontend`
3. **Configure:**
   ```
   Name: unpuzzle-instructor
   Environment: Node
   Root Directory: apps/instructor
   Build Command: npm ci && npm run build
   Start Command: npm start
   ```
4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_APP_SERVER_URL=https://dev.nazmulcodes.org
   NEXT_PUBLIC_M1_SERVER_URL=http://localhost:4000
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aG9wZWZ1bC1za2luay0xNy5jbGVyay5hY2NvdW50cy5kZXYk
   CLERK_SECRET_KEY=sk_test_gAzXahOCkEUgdHPOewgALZ7vCtJ8DkyKNxc1zrveva
   CLERK_SIGN_IN_URL=/sign-in
   CLERK_SIGN_UP_URL=/sign-up
   CLERK_AFTER_SIGN_IN_URL=/instructor/editor
   CLERK_AFTER_SIGN_UP_URL=/instructor/editor
   ```

## Deploy Student App

1. **Click "New +" → "Web Service"**
2. **Same repo**: `Muscled-clients-repo/unpuzzle-mono-repo-frontend`
3. **Configure:**
   ```
   Name: unpuzzle-student
   Environment: Node
   Root Directory: apps/student
   Build Command: npm ci && npm run build
   Start Command: npm start
   ```
4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://dev.nazmulcodes.org
   ```

## Important Settings

- **Root Directory**: Must be set to the specific app folder
- **Auto-Deploy**: Enable for automatic GitHub deployments
- **Free Plan**: Each service runs on the free tier

## Expected URLs

After deployment:
- Client: `https://unpuzzle-client.onrender.com`
- Instructor: `https://unpuzzle-instructor.onrender.com/instructor`
- Student: `https://unpuzzle-student.onrender.com/student`

## Troubleshooting

If builds still fail:
1. Check that "Root Directory" is correctly set
2. Verify Node.js version is 18+ in Advanced settings
3. Ensure environment variables are added
4. Check build logs for specific errors