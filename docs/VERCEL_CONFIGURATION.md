# Student App Vercel Configuration

## Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Required
NEXT_PUBLIC_API_URL=https://unpuzzle-ai-backend-9ce95198fbde.herokuapp.com

# Optional - for cross-app navigation
NEXT_PUBLIC_INSTRUCTOR_URL=https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app
```

## Vercel Build Settings
In Vercel Dashboard → Settings → General:

### Build & Development Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (uses root package.json)
- **Output Directory**: `.next`
- **Install Command**: `npm install --production=false`

### Root Directory
- Leave as `.` (root of monorepo)

### Node.js Version
- 18.x or 20.x (recommended)

## Domain Settings
- Primary domain: `unpuzzle-mono-repo-frontend.vercel.app`
- This is already configured and working

## Important Notes

1. **ESLint & TypeScript**: Currently configured to ignore errors during build (see next.config.ts)
   - `ignoreDuringBuilds: true` for ESLint
   - `ignoreBuildErrors: true` for TypeScript
   - Consider fixing these errors post-deployment

2. **Image Optimization**: Configured for unpuzzle.b-cdn.net
   - All images from this CDN will be automatically optimized

3. **Bundle Analysis**: Available with `ANALYZE=true npm run build`

4. **Monorepo Setup**: The root package.json handles the build commands
   - Ensures correct directory navigation
   - Installs dependencies properly

## Deployment Checklist
- [ ] Environment variables added in Vercel
- [ ] Root directory is set to `.`
- [ ] Build command uses root package.json
- [ ] Node.js version is 18.x or higher

## Cross-App Navigation
If you need to link to the instructor app, use:
```javascript
const instructorUrl = process.env.NEXT_PUBLIC_INSTRUCTOR_URL || 'https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app';
```