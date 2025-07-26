# Unpuzzle Monorepo

This is a monorepo containing multiple Next.js applications for the Unpuzzle platform.

## Structure

```
unpuzzle-mono-repo-frontend/
├── apps/
│   ├── client/         # Main landing page
│   ├── instructor/     # Instructor portal
│   └── student/        # Student portal
├── packages/
│   ├── ui/            # Shared UI components
│   ├── config/        # Shared configurations
│   ├── utils/         # Shared utilities
│   └── types/         # Shared TypeScript types
└── docs/              # Documentation
```

## Local Development

### Prerequisites
- Node.js 20+
- npm

### Installation & Running

```bash
# Install and run client app
cd apps/client
npm install
npm run dev

# Install and run instructor app
cd apps/instructor
npm install
npm run dev

# Install and run student app
cd apps/student
npm install
npm run dev
```

### Access URLs
- Client App: http://localhost:3004
- Instructor App: http://localhost:3002/instructor
- Student App: http://localhost:3003/student

## Testing Local Builds

```bash
# Test all app builds
./test-build.sh
```

## Deployment on Render

**Important**: Each app must be deployed separately as individual services.

### Step-by-Step Deployment:

1. **Go to [render.com](https://render.com)**
2. **Deploy Client App:**
   - New Web Service
   - Connect repo: `Muscled-clients-repo/unpuzzle-mono-repo-frontend`
   - **Root Directory**: `apps/client`
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`

3. **Deploy Instructor App:**
   - New Web Service
   - Same repo
   - **Root Directory**: `apps/instructor`
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`
   - Add environment variables from `.env.local`

4. **Deploy Student App:**
   - New Web Service
   - Same repo
   - **Root Directory**: `apps/student`
   - Build Command: `npm ci && npm run build`
   - Start Command: `npm start`

### 🔑 Critical Setting
**Always set "Root Directory"** to the specific app folder (`apps/client`, `apps/instructor`, or `apps/student`). This ensures Render builds the individual app instead of trying to build the entire monorepo.

## Environment Variables

Copy from `apps/instructor/.env.local`:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_APP_SERVER_URL`
- And others as needed

See `docs/RENDER_MANUAL_SETUP.md` for detailed deployment instructions.