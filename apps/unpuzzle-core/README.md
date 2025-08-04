# Unpuzzle - Interactive Learning Platform

Unpuzzle is an interactive learning platform that transforms video content into engaging puzzle-based learning experiences. The platform uses AI agents to generate puzzles, hints, and learning paths from video transcripts.

## 🚀 Features

- **Video Processing**: YouTube video integration with automatic transcript generation
- **AI-Powered Puzzles**: Dynamic puzzle generation from video content
- **Interactive Learning**: Multiple learning modes (checks, hints, paths, reflections)
- **Real-time Processing**: WebSocket support for real-time interactions
- **User Analytics**: Activity tracking and learning progress monitoring
- **Payment Integration**: Stripe payment processing for premium content

## 🏗️ Architecture

```
unpuzzle/
├── contexts/           # Business logic and services
│   ├── agents/        # AI agents for puzzle generation
│   └── services/      # External service integrations
├── models/            # Data models and database schemas
├── protocols/         # API controllers and routes
├── public/           # Static assets (CSS, JS, images)
├── types/            # TypeScript type definitions
└── views/            # Pug templates for server-side rendering
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **AI Services**: OpenAI, Google Gemini, Whisper
- **Video Processing**: Mux, FFmpeg, YouTube API
- **Payment**: Stripe
- **Frontend**: Pug templates, Tailwind CSS, Vanilla JavaScript
- **Real-time**: Socket.io

## 📋 Prerequisites

- Node.js (v20)
- npm or yarn
- Supabase account
- Clerk account
- OpenAI API key
- Google API key
- Stripe account
- Mux account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:Muscled-clients-repo/unpuzzle-ai-agent.git
   cd unpuzzle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # Database (Supabase)
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Authentication (Clerk)
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # AI Services
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   
   # Video Services
   YOUTUBE_API_KEY=your_youtube_api_key
   MUX_TOKEN_ID=your_mux_token_id
   MUX_TOKEN_SECRET=your_mux_token_secret
   
   # Payment (Stripe)
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   
   # File Storage
   UPLOAD_PATH=./uploads
   ```

4. **Database Setup**
   Run the SQL scripts in `models/schema/` to create the database tables.

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🚀 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Type checking
npm run type-check
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
All API endpoints require authentication via Clerk. Include the user token in the request headers:
```
Authorization: Bearer <user_token>
```

---

## 🎯 Core API Endpoints

### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Videos

#### Get Video by ID
```http
GET /api/videos/:videoId
```
**Parameters:**
- `videoId` (string, required): Video ID

**Response:**
```json
{
  "id": "video_123",
  "title": "Introduction to JavaScript",
  "video_url": "https://youtube.com/watch?v=...",
  "yt_video_id": "abc123",
  "chapter_id": "chapter_456",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### Create Video
```http
POST /api/videos/:videoId/chapters/:chapterId
```
**Parameters:**
- `videoId` (string, required): YouTube video ID
- `chapterId` (string, required): Chapter ID

**Response:**
```json
{
  "id": "video_123",
  "title": "Introduction to JavaScript",
  "video_url": "https://youtube.com/watch?v=...",
  "yt_video_id": "abc123",
  "chapter_id": "chapter_456",
  "transcripts": [...]
}
```

---

### Transcripts

#### Get Transcripts
```http
GET /api/transcripts?videoId=:videoId
```
**Parameters:**
- `videoId` (string, required): Video ID

**Response:**
```json
[
  {
    "id": "transcript_123",
    "video_id": "video_456",
    "start_time_sec": 0,
    "end_time_sec": 5,
    "content": "Hello, welcome to this tutorial..."
  }
]
```

#### Create Transcript
```http
POST /api/transcripts
```
**Body:**
```json
{
  "videoId": "video_123"
}
```

#### Upload Transcript File
```http
POST /api/transcripts/upload
```
**Body:** `multipart/form-data`
- `srtFile` (file, required): SRT subtitle file
- `videoId` (string, required): Video ID

---

### Puzzle Checks

#### Generate Puzzle Check
```http
GET /api/puzzel-checks?videoId=:videoId&endTime=:endTime
```
**Parameters:**
- `videoId` (string, required): Video ID
- `endTime` (number, required): End time in seconds

**Response:**
```json
{
  "topic": "JavaScript Fundamentals",
  "completion": [
    {
      "question": "What is JavaScript?",
      "choices": ["A programming language", "A markup language", "A styling language"],
      "answer": "A programming language"
    }
  ]
}
```

---

### Puzzle Hints

#### Generate Puzzle Hint
```http
POST /api/puzzle-hint
```
**Body:**
```json
{
  "videoId": "video_123",
  "startTime": 30,
  "instruction": "Generate a hint for this concept"
}
```

**Response:**
```json
{
  "hint": "Think about the relationship between variables and functions...",
  "context": "In JavaScript, functions can access variables from their outer scope..."
}
```

#### Get Puzzle Hint
```http
GET /api/puzzle-hint?videoId=:videoId&startTime=:startTime
```

---

### Puzzle Paths

#### Get Learning Path
```http
GET /api/puzzel-path?videoId=:videoId&currentTime=:currentTime
```
**Parameters:**
- `videoId` (string, required): Video ID
- `currentTime` (number, required): Current time in seconds

**Response:**
```json
{
  "path": [
    {
      "step": 1,
      "title": "Understanding Variables",
      "description": "Learn about variable declaration and assignment",
      "timestamp": 45
    }
  ]
}
```

#### Create Learning Path
```http
POST /api/puzzel-path
```
**Body:**
```json
{
  "videoId": "video_123",
  "currentTime": 30,
  "instruction": "Create a learning path for this topic"
}
```

---

### Puzzle Reflections

#### Generate Reflection
```http
POST /api/puzzel-reflects
```
**Body:**
```json
{
  "videoId": "video_123",
  "startTime": 30,
  "instruction": "Generate a reflection question"
}
```

**Response:**
```json
{
  "reflection": "How would you apply this concept in a real-world scenario?",
  "context": "Consider the practical applications of this programming concept..."
}
```

#### Create Loom Link Reflection
```http
POST /api/puzzel-reflects/loom-link
```
**Body:**
```json
{
  "videoId": "video_123",
  "loomUrl": "https://www.loom.com/share/...",
  "instruction": "Create reflection based on this video"
}
```

---

### Products & Orders

#### Get All Products
```http
GET /api/products
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Create Product
```http
POST /api/products
```
**Body:**
```json
{
  "name": "Premium Course",
  "description": "Advanced JavaScript concepts",
  "price": 99.99,
  "currency": "USD"
}
```

#### Create Order
```http
POST /api/orders
```
**Body:**
```json
{
  "productId": "product_123",
  "quantity": 1
}
```

---

### Activity Logs

#### Get All Activity Logs
```http
GET /api/activity-logs
```

#### Get Activity Log by ID
```http
GET /api/activity-logs/:id
```

#### Get User Activity Logs
```http
GET /api/activity-logs/user/:userId
```

#### Create Activity Log
```http
POST /api/activity-logs
```
**Body:**
```json
{
  "title": "Puzzle Check Completed",
  "user_id": "user_123",
  "video_id": "video_456",
  "actionType": "puzzle_check",
  "duration": 300
}
```

---

### Video Processing

#### Mux Upload
```http
POST /api/mux/upload
```
**Body:**
```json
{
  "url": "https://example.com/video.mp4"
}
```

#### Get Playback Info
```http
GET /api/mux/playback/:id
```

#### Get Video Status
```http
GET /api/mux/status/:id
```

---

### AI Services

#### Whisper Transcription
```http
POST /api/whisper/transcribe
```
**Body:** `multipart/form-data`
- `audioFile` (file, required): Audio file to transcribe

#### Get Transcription Status
```http
GET /api/whisper/status/:id
```

---

### Webhooks

#### Clerk Webhook
```http
POST /api/webhook/clerk
```
Handles Clerk authentication events.

#### Stripe Webhook
```http
POST /api/webhook/stripe
```
Handles Stripe payment events.

---

## 🔧 Development Guidelines

### Code Structure

1. **Controllers** (`protocols/controllers/`): Handle HTTP requests and responses
2. **Models** (`models/`): Database models and validation schemas
3. **Services** (`contexts/services/`): Business logic and external service integrations
4. **Agents** (`contexts/agents/`): AI-powered puzzle generation logic
5. **Routes** (`protocols/routes/`): API route definitions
6. **Types** (`types/`): TypeScript type definitions

### Error Handling

All API endpoints use the `ResponseHandler` utility for consistent error responses:

```typescript
const responseHandler = new ResponseHandler(res, next);
try {
  // Your logic here
  responseHandler.success(data);
} catch (error) {
  responseHandler.error(error as Error);
}
```

### Database Operations

Use the Supabase client for database operations:

```typescript
import supabase from "../models/supabase/client";

const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("column", value);
```

### Authentication

Use Clerk middleware for authentication:

```typescript
import { requireAuth } from "@clerk/express";

router.use(requireAuth({ signInUrl: "/signin" }));
```

### File Uploads

Use the UploadMiddleware for file uploads:

```typescript
import UploadMiddleware from "../../middleware/UploadMiddleware";

router.post("/upload", UploadMiddleware.singleFileUpload("fileField"), controller.uploadFile);
```

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Structure
- Unit tests for individual functions
- Integration tests for API endpoints
- E2E tests for complete user flows

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Ensure all production environment variables are set in your deployment platform.

### Database Migration
Run database migrations before deploying:
```sql
-- Run the SQL scripts in models/schema/
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This documentation is a living document. Please update it as the project evolves. 