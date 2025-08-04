# Development Guide - Unpuzzle

This guide provides detailed instructions for setting up and contributing to the Unpuzzle project.

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v20
- **npm**: v8.0.0 or higher (or yarn v1.22.0+)
- **Git**: Latest version
- **PostgreSQL**: v13 or higher (via Supabase)
- **FFmpeg**: For video processing (optional, for local development)

### System Requirements

- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: At least 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
# Using SSH
git clone git@github.com:Muscled-clients-repo/unpuzzle-ai-agent.git

# OR Using HTTPS
git clone https://github.com/Muscled-clients-repo/unpuzzle-ai-agent.git

cd unpuzzle-ai-agent
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in the required environment variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
HOST=localhost

# Database (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# AI Services
OPENAI_API_KEY=sk-your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

# Video Services
YOUTUBE_API_KEY=your_youtube_api_key
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret

# Payment (Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# File Storage
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Logging
LOG_LEVEL=debug
LOG_FILE=./logs/app.log

# Security
SESSION_SECRET=your_session_secret
CORS_ORIGIN=http://localhost:3000

# Redis (for caching and sessions)
REDIS_URL=redis://localhost:6379

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

### 4. Database Setup

#### Option A: Using Supabase (Recommended)

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and API keys
4. Run the database migrations:

```bash
# Connect to your Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run the schema files
\i models/schema/user.sql
\i models/schema/video.sql
\i models/schema/transcript.sql
\i models/schema/puzzles.sql
\i models/schema/relatedVideo.sql
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
```sql
CREATE DATABASE unpuzzle_dev;
CREATE USER unpuzzle_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE unpuzzle_dev TO unpuzzle_user;
```

### 5. Start Development Server

```bash
# Start the development server
npm run dev

# Or using yarn
yarn dev
```

The server will start at `http://localhost:3001`

## 🏗️ Project Structure

```
unpuzzle/
├── contexts/                 # Business logic layer
│   ├── agents/              # AI agents for puzzle generation
│   │   ├── BaseAgent.ts     # Base agent class
│   │   ├── PuzzleCheck.ts   # Puzzle check generation
│   │   ├── PuzzleHint.ts    # Puzzle hint generation
│   │   ├── PuzzlePath.ts    # Learning path generation
│   │   └── VideoDescription.ts
│   └── services/            # External service integrations
│       ├── ffmpeg.ts        # Video processing
│       ├── GeminiService.ts # Google Gemini AI
│       ├── Mux.ts          # Video hosting
│       ├── openAI.ts       # OpenAI integration
│       ├── StripeServices.ts # Payment processing
│       ├── supabaseStorage.ts # File storage
│       ├── Whisper.ts      # Speech-to-text
│       └── youtubeTranscript.ts # YouTube integration
├── models/                  # Data layer
│   ├── schema/             # Database schemas
│   ├── supabase/           # Supabase models
│   └── validator/          # Data validation
├── protocols/              # API layer
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── routes/            # Route definitions
│   └── utility/           # Utility functions
├── public/                # Static assets
│   ├── css/              # Stylesheets
│   ├── js/               # Client-side JavaScript
│   └── img/              # Images
├── types/                 # TypeScript type definitions
├── views/                 # Pug templates
└── uploads/              # File uploads (gitignored)
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --grep "PuzzleCheck"

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── unit/                  # Unit tests
│   ├── agents/           # Agent tests
│   ├── services/         # Service tests
│   └── utils/            # Utility tests
├── integration/          # Integration tests
│   ├── api/             # API endpoint tests
│   └── database/        # Database tests
└── e2e/                 # End-to-end tests
```

### Writing Tests

```typescript
// Example test
import { describe, it, expect, beforeEach } from 'jest';
import { PuzzleCheckAgent } from '../../contexts/agents/PuzzleCheck';

describe('PuzzleCheckAgent', () => {
  let agent: PuzzleCheckAgent;

  beforeEach(() => {
    agent = new PuzzleCheckAgent();
  });

  it('should generate puzzle check', async () => {
    const result = await agent.generateCheck({
      videoId: 'test_video',
      topic: 'JavaScript Basics',
      transcript: 'This is a test transcript'
    });

    expect(result).toHaveProperty('topic');
    expect(result).toHaveProperty('completion');
    expect(Array.isArray(result.completion)).toBe(true);
  });
});
```

## 🔍 Debugging

### VS Code Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/index.ts",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Logging

The project uses a custom logger. Configure logging levels:

```typescript
import logger from './protocols/utility/logger';

logger.info('Application started');
logger.error('An error occurred', { error: err });
logger.debug('Debug information', { data: someData });
```

### Database Debugging

```bash
# Connect to Supabase database
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# View tables
\dt

# Query data
SELECT * FROM videos LIMIT 10;

# Check indexes
\di
```

## 🚀 Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/new-puzzle-type

# Make changes
# ... your code changes ...

# Run tests
npm test

# Check linting
npm run lint

# Type checking
npm run type-check

# Commit changes
git add .
git commit -m "feat: add new puzzle type"

# Push to remote
git push origin feature/new-puzzle-type
```

### 2. Code Quality

#### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Check TypeScript
npm run type-check
```

#### Pre-commit Hooks

Install husky for pre-commit hooks:

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npm run lint-staged"
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### 3. API Development

#### Adding New Endpoints

1. Create controller in `protocols/controllers/api/`
2. Add route in `protocols/routes/api/`
3. Update types in `types/`
4. Add tests
5. Update documentation

Example:

```typescript
// protocols/controllers/api/newFeature.controller.ts
import { Request, Response, NextFunction } from "express";
import ResponseHandler from "../../utility/ResponseHandler";

class NewFeatureController {
  getFeature = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      // Your logic here
      responseHandler.success(data);
    } catch (error) {
      responseHandler.error(error as Error);
    }
  };
}

export default new NewFeatureController();
```

```typescript
// protocols/routes/api/newFeature.routes.ts
import { Router } from "express";
import newFeatureController from "../../controllers/api/newFeature.controller";

const router = Router();

router.get("/", newFeatureController.getFeature);

export default router;
```

### 4. Database Changes

#### Adding New Tables

1. Create SQL schema file in `models/schema/`
2. Update TypeScript types in `types/`
3. Create model in `models/supabase/`
4. Add validation in `models/validator/`

Example:

```sql
-- models/schema/newTable.sql
CREATE TABLE IF NOT EXISTS public.new_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3001 |
| `NODE_ENV` | Environment | No | development |
| `SUPABASE_URL` | Supabase project URL | Yes | - |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | - |
| `CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes | - |

### Database Configuration

```typescript
// models/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export default supabase;
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t unpuzzle .
docker run -p 3001:3001 unpuzzle
```

### Environment-Specific Configs

Create environment-specific configuration files:

```typescript
// config/development.ts
export default {
  database: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  },
  server: {
    port: 3001,
    host: 'localhost'
  }
};
```

```typescript
// config/production.ts
export default {
  database: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  },
  server: {
    port: process.env.PORT || 3001,
    host: '0.0.0.0'
  }
};
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Issues

```bash
# Check Supabase connection
curl -X GET "https://your-project.supabase.co/rest/v1/" \
  -H "apikey: your_anon_key"

# Verify environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY
```

#### 2. Authentication Issues

```bash
# Check Clerk configuration
curl -X GET "https://api.clerk.dev/v1/users" \
  -H "Authorization: Bearer your_secret_key"
```

#### 3. File Upload Issues

```bash
# Check upload directory permissions
ls -la uploads/
chmod 755 uploads/

# Check file size limits
echo $MAX_FILE_SIZE
```

#### 4. Memory Issues

```bash
# Monitor memory usage
node --max-old-space-size=4096 index.ts

# Check for memory leaks
npm install --save-dev node-memwatch
```

### Performance Optimization

#### 1. Database Queries

```typescript
// Use indexes for frequently queried columns
CREATE INDEX idx_videos_chapter_id ON videos(chapter_id);
CREATE INDEX idx_transcripts_video_id ON transcripts(video_id);

// Use pagination for large datasets
const { data, error } = await supabase
  .from('videos')
  .select('*')
  .range(0, 9);
```

#### 2. Caching

```typescript
// Implement Redis caching
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache expensive operations
const getCachedData = async (key: string) => {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await expensiveOperation();
  await redis.setex(key, 3600, JSON.stringify(data));
  return data;
};
```

#### 3. API Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/unpuzzle/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/unpuzzle/discussions)
- **Email**: dev-support@unpuzzle.com

---

**Last Updated**: January 2024 