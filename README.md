# Unpuzzle Monorepo

This is a monorepo containing multiple Next.js applications for the Unpuzzle platform.

## Structure

```
unpuzzle-mono-repo-frontend/
├── apps/
│   ├── client/         # Main landing page (unpuzzle.com)
│   ├── instructor/     # Instructor portal (unpuzzle.com/instructor)
│   └── student/        # Student portal (unpuzzle.com/student)
├── packages/
│   ├── ui/            # Shared UI components
│   ├── config/        # Shared configurations
│   ├── utils/         # Shared utilities
│   └── types/         # Shared TypeScript types
└── docs/              # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

Run all apps in development mode:

```bash
pnpm dev
```

Or run specific apps:

```bash
# Run only the instructor app
pnpm dev --filter=@unpuzzle/instructor

# Run only the client app
pnpm dev --filter=@unpuzzle/client
```

### Access URLs

- Client App: http://localhost:3001
- Instructor App: http://localhost:3002/instructor
- Student App: http://localhost:3003/student

### Using Nginx (Optional)

To access all apps under a single domain (http://localhost:3000):

1. Install nginx
2. Run: `nginx -c $(pwd)/nginx/nginx.local.conf`
3. Access:
   - http://localhost:3000 (client)
   - http://localhost:3000/instructor
   - http://localhost:3000/student

## Building

Build all apps:

```bash
pnpm build
```

Build specific app:

```bash
pnpm build --filter=@unpuzzle/instructor
```

## Deployment

### Option 1: Vercel

Each app can be deployed separately to Vercel with proper routing configuration.

### Option 2: Docker

Use the provided Docker configurations for containerized deployment.

### Option 3: Traditional Server

Deploy with PM2 or similar process managers with nginx as reverse proxy.

## Adding New Apps

1. Create new app in `apps/` directory
2. Configure `basePath` in `next.config.ts`
3. Update nginx configuration if needed
4. Add to pnpm workspace

## Shared Packages

- `@unpuzzle/ui`: Shared React components
- `@unpuzzle/config`: Shared ESLint, TypeScript configs
- `@unpuzzle/utils`: Shared utility functions
- `@unpuzzle/types`: Shared TypeScript types