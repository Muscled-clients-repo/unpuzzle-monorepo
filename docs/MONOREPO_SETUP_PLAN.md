# Monorepo Setup Plan for Multiple Next.js Apps

## Overview
This document outlines the plan for setting up a monorepo structure to host multiple Next.js applications under the same domain.

## Architecture

### Monorepo Structure
```
unpuzzle-mono-repo-frontend/
├── apps/
│   ├── client/         (main app - unpuzzle.com)
│   ├── instructor/     (instructor portal - unpuzzle.com/instructor)
│   ├── student/        (student portal - unpuzzle.com/student)
│   └── admin/          (admin dashboard - unpuzzle.com/admin)
├── packages/
│   ├── ui/             (shared UI components)
│   ├── config/         (shared configs - ESLint, TypeScript, etc.)
│   ├── utils/          (shared utilities)
│   └── types/          (shared TypeScript types)
├── services/
│   ├── api/            (backend API)
│   └── media/          (media processing)
└── docs/               (all documentation)
```

## Development Environment Setup

### Tools & Technologies
1. **Monorepo Manager**: Turborepo (recommended) or Nx
2. **Package Manager**: pnpm (for efficient disk space usage)
3. **Routing**: Nginx reverse proxy for local development
4. **Process Manager**: PM2 or Docker Compose

### Local Development Configuration

#### Nginx Configuration
```nginx
# nginx.conf for local development
server {
    listen 3000;
    
    location / {
        proxy_pass http://localhost:3001;  # client app
    }
    
    location /instructor {
        proxy_pass http://localhost:3002;  # instructor app
    }
    
    location /student {
        proxy_pass http://localhost:3003;  # student app
    }
    
    location /admin {
        proxy_pass http://localhost:3004;  # admin app
    }
    
    location /api {
        proxy_pass http://localhost:5000;  # API server
    }
}
```

## Production Deployment Strategy

### Option 1: Vercel (Recommended for Next.js)
- **Multi-zone deployment** with path-based routing
- Each app deployed as separate Vercel project
- Configure `vercel.json` for routing:

```json
{
  "rewrites": [
    { "source": "/instructor/:path*", "destination": "https://instructor.vercel.app/:path*" },
    { "source": "/student/:path*", "destination": "https://student.vercel.app/:path*" },
    { "source": "/admin/:path*", "destination": "https://admin.vercel.app/:path*" }
  ]
}
```

### Option 2: AWS/GCP with Kubernetes
- Deploy all apps as separate services
- Use Ingress controller for path-based routing
- Benefits: More control, better for complex requirements

### Option 3: Traditional VPS with PM2/Docker
- Use Nginx as reverse proxy
- PM2 for process management
- Docker Compose for containerization

## Implementation Steps

### 1. Setup Turborepo
```bash
# Install Turborepo
npm install turbo --save-dev

# Initialize configuration
npx turbo init
```

### 2. Configure Path-based Routing
Each Next.js app needs to be configured with its base path:

```typescript
// apps/instructor/next.config.ts
export default {
  basePath: '/instructor',
  assetPrefix: '/instructor',
  images: {
    path: '/instructor/_next/image'
  }
}
```

### 3. Shared Package Development
Create shared packages for common functionality:

```bash
# Create shared packages
mkdir -p packages/ui packages/config packages/utils packages/types
```

### 4. Environment Configuration
- Centralized `.env` management using dotenv-mono
- Environment-specific configurations
- Secret management with tools like Vault or AWS Secrets Manager

### 5. CI/CD Pipeline
```yaml
# Example GitHub Actions workflow
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - name: Install dependencies
        run: pnpm install
      - name: Build
        run: pnpm turbo build
      - name: Deploy
        run: pnpm turbo deploy
```

## Key Configurations

### Turborepo Configuration
```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "start": "turbo start",
    "lint": "turbo lint",
    "test": "turbo test"
  }
}
```

## Benefits
1. **Single Domain**: All apps accessible via unpuzzle.com
2. **Code Sharing**: Shared components and utilities reduce duplication
3. **Independent Deployments**: Deploy apps separately when needed
4. **Scalability**: Each app can scale independently
5. **Development Efficiency**: Parallel development with shared tooling
6. **Type Safety**: Shared TypeScript types across all apps
7. **Consistent UI/UX**: Shared component library ensures consistency

## Migration Plan
1. Create new monorepo structure
2. Move existing apps into `apps/` directory
3. Extract shared code into packages
4. Configure build tools and routing
5. Update CI/CD pipelines
6. Test thoroughly in staging
7. Deploy to production

## Security Considerations
- Implement proper CORS policies
- Use environment-specific API keys
- Set up proper authentication middleware
- Configure CSP headers for each app
- Regular security audits

## Performance Optimization
- Implement code splitting
- Use dynamic imports for route-based code splitting
- Configure proper caching strategies
- Optimize shared dependencies
- Use CDN for static assets