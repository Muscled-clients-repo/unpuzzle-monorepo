# Unpuzzle API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [Error Handling](#error-handling)
5. [Endpoints](#endpoints)
   - [Health](#health)
   - [Videos](#videos)
   - [Transcripts](#transcripts)
   - [Puzzle Checks](#puzzle-checks)
   - [Puzzle Hints](#puzzle-hints)
   - [Puzzle Paths](#puzzle-paths)
   - [Puzzle Reflections](#puzzle-reflections)
   - [Products](#products)
   - [Orders](#orders)
   - [Activity Logs](#activity-logs)
   - [Mux Video Processing](#mux-video-processing)
   - [Whisper AI](#whisper-ai)
   - [Webhooks](#webhooks)

## Overview

The Unpuzzle API is a RESTful service that provides endpoints for managing interactive learning experiences. The API uses Clerk for authentication and Supabase for data storage.

## Authentication

All API endpoints require authentication via Clerk. Include the user token in the request headers:

```http
Authorization: Bearer <user_token>
```

## Base URL

```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## Endpoints

### Health

#### GET /health

Check API health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0"
  }
}
```

---

### Videos

#### GET /videos/:videoId

Get video by ID.

**Parameters:**
- `videoId` (string, required): Video ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "video_123",
    "title": "Introduction to JavaScript",
    "description": "Learn the basics of JavaScript programming",
    "video_url": "https://youtube.com/watch?v=abc123",
    "yt_video_id": "abc123",
    "chapter_id": "chapter_456",
    "default_source": "youtube",
    "thumbnails": {
      "default": "https://i.ytimg.com/vi/abc123/default.jpg",
      "medium": "https://i.ytimg.com/vi/abc123/mqdefault.jpg",
      "high": "https://i.ytimg.com/vi/abc123/hqdefault.jpg"
    },
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /videos/:videoId/chapters/:chapterId

Create a new video from YouTube URL.

**Parameters:**
- `videoId` (string, required): YouTube video ID
- `chapterId` (string, required): Chapter ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "video_123",
    "title": "Introduction to JavaScript",
    "video_url": "https://youtube.com/watch?v=abc123",
    "yt_video_id": "abc123",
    "chapter_id": "chapter_456",
    "transcripts": [
      {
        "id": "transcript_1",
        "video_id": "video_123",
        "start_time_sec": 0,
        "end_time_sec": 5,
        "content": "Hello, welcome to this tutorial..."
      }
    ]
  }
}
```

---

### Transcripts

#### GET /transcripts

Get transcripts for a video.

**Query Parameters:**
- `videoId` (string, required): Video ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "transcript_1",
      "video_id": "video_123",
      "start_time_sec": 0,
      "end_time_sec": 5,
      "content": "Hello, welcome to this tutorial on JavaScript fundamentals."
    },
    {
      "id": "transcript_2",
      "video_id": "video_123",
      "start_time_sec": 5,
      "end_time_sec": 10,
      "content": "In this video, we'll cover variables, functions, and basic syntax."
    }
  ]
}
```

#### POST /transcripts

Create transcript from YouTube video.

**Request Body:**
```json
{
  "videoId": "video_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "transcript_1",
      "video_id": "video_123",
      "start_time_sec": 0,
      "end_time_sec": 5,
      "content": "Hello, welcome to this tutorial..."
    }
  ]
}
```

#### POST /transcripts/upload

Upload SRT transcript file.

**Request Body:** `multipart/form-data`
- `srtFile` (file, required): SRT subtitle file
- `videoId` (string, required): Video ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "transcript_1",
      "video_id": "video_123",
      "start_time_sec": 0,
      "end_time_sec": 5,
      "content": "Hello, welcome to this tutorial..."
    }
  ]
}
```

---

### Puzzle Checks

#### GET /puzzel-checks

Generate puzzle check for a video segment.

**Query Parameters:**
- `videoId` (string, required): Video ID
- `endTime` (number, required): End time in seconds

**Response:**
```json
{
  "success": true,
  "data": {
    "topic": "JavaScript Variables and Functions",
    "completion": [
      {
        "id": "check_1",
        "question": "What keyword is used to declare a variable in JavaScript?",
        "choices": [
          "var",
          "let",
          "const",
          "All of the above"
        ],
        "answer": "All of the above",
        "explanation": "JavaScript supports three ways to declare variables: var, let, and const."
      },
      {
        "id": "check_2",
        "question": "Which of the following is a function declaration?",
        "choices": [
          "function myFunc() {}",
          "const myFunc = () => {}",
          "let myFunc = function() {}",
          "All of the above"
        ],
        "answer": "All of the above",
        "explanation": "All three are valid ways to create functions in JavaScript."
      }
    ]
  }
}
```

---

### Puzzle Hints

#### POST /puzzle-hint

Generate puzzle hint for a specific timestamp.

**Request Body:**
```json
{
  "videoId": "video_123",
  "startTime": 30,
  "instruction": "Generate a hint for understanding variables"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hint": "Think about variables as containers that can hold different types of data. They have names and values that can change over time.",
    "context": "In JavaScript, variables are used to store data values. The 'let' keyword allows you to reassign values, while 'const' creates read-only references.",
    "timestamp": 30,
    "video_id": "video_123"
  }
}
```

#### GET /puzzle-hint

Get existing puzzle hint.

**Query Parameters:**
- `videoId` (string, required): Video ID
- `startTime` (number, required): Start time in seconds

**Response:**
```json
{
  "success": true,
  "data": {
    "hint": "Think about variables as containers...",
    "context": "In JavaScript, variables are used to store data values...",
    "timestamp": 30,
    "video_id": "video_123"
  }
}
```

---

### Puzzle Paths

#### GET /puzzel-path

Get learning path for a video.

**Query Parameters:**
- `videoId` (string, required): Video ID
- `currentTime` (number, required): Current time in seconds

**Response:**
```json
{
  "success": true,
  "data": {
    "path": [
      {
        "id": "path_1",
        "step": 1,
        "title": "Understanding Variables",
        "description": "Learn about variable declaration and assignment in JavaScript",
        "timestamp": 45,
        "duration": 120,
        "difficulty": "beginner"
      },
      {
        "id": "path_2",
        "step": 2,
        "title": "Function Basics",
        "description": "Explore function declaration and calling",
        "timestamp": 165,
        "duration": 180,
        "difficulty": "beginner"
      }
    ],
    "total_steps": 2,
    "estimated_duration": 300
  }
}
```

#### POST /puzzel-path

Create custom learning path.

**Request Body:**
```json
{
  "videoId": "video_123",
  "currentTime": 30,
  "instruction": "Create a learning path focusing on advanced concepts"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "path": [
      {
        "id": "path_1",
        "step": 1,
        "title": "Advanced Variable Concepts",
        "description": "Deep dive into hoisting and scope",
        "timestamp": 45,
        "duration": 120,
        "difficulty": "advanced"
      }
    ]
  }
}
```

---

### Puzzle Reflections

#### POST /puzzel-reflects

Generate reflection question.

**Request Body:**
```json
{
  "videoId": "video_123",
  "startTime": 30,
  "instruction": "Generate a reflection question about variable scope"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reflection": "How would you explain the concept of variable scope to someone who has never programmed before?",
    "context": "Variable scope determines where variables can be accessed in your code. Understanding this concept is crucial for writing maintainable JavaScript.",
    "timestamp": 30,
    "video_id": "video_123",
    "difficulty": "intermediate"
  }
}
```

#### POST /puzzel-reflects/loom-link

Create reflection based on Loom video.

**Request Body:**
```json
{
  "videoId": "video_123",
  "loomUrl": "https://www.loom.com/share/abc123",
  "instruction": "Create reflection based on this screen recording"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reflection": "Based on the screen recording, how would you implement the same functionality in your own project?",
    "context": "The video demonstrates a practical implementation of JavaScript concepts.",
    "loom_url": "https://www.loom.com/share/abc123",
    "video_id": "video_123"
  }
}
```

---

### Products

#### GET /products

Get all products.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "product_1",
      "name": "JavaScript Fundamentals Course",
      "description": "Complete course on JavaScript basics",
      "price": 99.99,
      "currency": "USD",
      "features": [
        "50+ video lessons",
        "Interactive puzzles",
        "Certificate of completion"
      ],
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /products/:id

Get product by ID.

**Parameters:**
- `id` (string, required): Product ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "product_1",
    "name": "JavaScript Fundamentals Course",
    "description": "Complete course on JavaScript basics",
    "price": 99.99,
    "currency": "USD",
    "features": [
      "50+ video lessons",
      "Interactive puzzles",
      "Certificate of completion"
    ],
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /products

Create new product.

**Request Body:**
```json
{
  "name": "Advanced JavaScript Course",
  "description": "Advanced JavaScript concepts and patterns",
  "price": 149.99,
  "currency": "USD",
  "features": [
    "Advanced concepts",
    "Real-world projects",
    "Code reviews"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "product_2",
    "name": "Advanced JavaScript Course",
    "description": "Advanced JavaScript concepts and patterns",
    "price": 149.99,
    "currency": "USD",
    "features": [
      "Advanced concepts",
      "Real-world projects",
      "Code reviews"
    ],
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /products/:id

Update product.

**Parameters:**
- `id` (string, required): Product ID

**Request Body:**
```json
{
  "name": "Updated Course Name",
  "price": 129.99
}
```

#### DELETE /products/:id

Delete product.

**Parameters:**
- `id` (string, required): Product ID

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### Orders

#### POST /orders

Create new order.

**Request Body:**
```json
{
  "productId": "product_1",
  "quantity": 1,
  "customerEmail": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order_1",
    "product_id": "product_1",
    "user_id": "user_123",
    "quantity": 1,
    "total_amount": 99.99,
    "currency": "USD",
    "status": "pending",
    "payment_intent_id": "pi_1234567890",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Activity Logs

#### GET /activity-logs

Get all activity logs.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `userId` (string, optional): Filter by user ID
- `actionType` (string, optional): Filter by action type

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "log_1",
      "title": "Puzzle Check Completed",
      "user_id": "user_123",
      "video_id": "video_456",
      "actionType": "puzzle_check",
      "fromTime": 0,
      "toTime": 300,
      "duration": 300,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### GET /activity-logs/:id

Get activity log by ID.

**Parameters:**
- `id` (string, required): Activity log ID

#### GET /activity-logs/user/:userId

Get user activity logs.

**Parameters:**
- `userId` (string, required): User ID

#### POST /activity-logs

Create activity log.

**Request Body:**
```json
{
  "title": "Video Watched",
  "user_id": "user_123",
  "video_id": "video_456",
  "actionType": "video_watch",
  "fromTime": 0,
  "toTime": 600,
  "duration": 600
}
```

#### PUT /activity-logs/:id

Update activity log.

**Parameters:**
- `id` (string, required): Activity log ID

#### DELETE /activity-logs/:id

Delete activity log.

**Parameters:**
- `id` (string, required): Activity log ID

---

### Mux Video Processing

#### POST /mux/upload

Upload video to Mux.

**Request Body:**
```json
{
  "url": "https://example.com/video.mp4",
  "title": "My Video",
  "description": "Video description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "mux_video_1",
    "playback_id": "playback_123",
    "status": "uploading",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /mux/playback/:id

Get playback information.

**Parameters:**
- `id` (string, required): Playback ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "playback_123",
    "url": "https://stream.mux.com/playback_123.m3u8",
    "status": "ready",
    "duration": 3600,
    "aspect_ratio": "16:9"
  }
}
```

#### GET /mux/status/:id

Get video processing status.

**Parameters:**
- `id` (string, required): Video ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "mux_video_1",
    "status": "ready",
    "progress": 100,
    "error": null
  }
}
```

#### DELETE /mux/:id

Delete video from Mux.

**Parameters:**
- `id` (string, required): Video ID

---

### Whisper AI

#### POST /whisper/transcribe

Transcribe audio file using Whisper.

**Request Body:** `multipart/form-data`
- `audioFile` (file, required): Audio file to transcribe
- `language` (string, optional): Language code (default: "en")

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "transcription_1",
    "status": "processing",
    "estimated_completion": "2024-01-01T00:05:00.000Z"
  }
}
```

#### GET /whisper/status/:id

Get transcription status.

**Parameters:**
- `id` (string, required): Transcription ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "transcription_1",
    "status": "completed",
    "transcript": "Hello, this is the transcribed text...",
    "segments": [
      {
        "start": 0,
        "end": 5,
        "text": "Hello, this is the transcribed text..."
      }
    ],
    "language": "en",
    "duration": 300
  }
}
```

---

### Webhooks

#### POST /webhook/clerk

Handle Clerk authentication events.

**Headers:**
```http
Clerk-Signature: <signature>
Clerk-Webhook-Timestamp: <timestamp>
```

**Request Body:**
```json
{
  "type": "user.created",
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /webhook/stripe

Handle Stripe payment events.

**Headers:**
```http
Stripe-Signature: <signature>
```

**Request Body:**
```json
{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_1234567890",
      "amount": 9999,
      "currency": "usd",
      "status": "succeeded"
    }
  }
}
```

---

## Rate Limiting

The API implements rate limiting to ensure fair usage:

- **Authenticated users**: 1000 requests per hour
- **Unauthenticated users**: 100 requests per hour

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination with the following query parameters:

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)

Pagination metadata is included in responses:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## WebSocket Events

The API also supports real-time communication via WebSocket:

### Connection
```javascript
const socket = io('http://localhost:3001');
```

### Events

#### `puzzle_generated`
Emitted when a new puzzle is generated.
```javascript
socket.on('puzzle_generated', (data) => {
  console.log('New puzzle:', data);
});
```

#### `transcript_ready`
Emitted when transcript processing is complete.
```javascript
socket.on('transcript_ready', (data) => {
  console.log('Transcript ready:', data);
});
```

#### `user_activity`
Emitted when user activity is logged.
```javascript
socket.on('user_activity', (data) => {
  console.log('User activity:', data);
});
```

---

## SDK Examples

### JavaScript/TypeScript

```javascript
class UnpuzzleAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async getVideo(videoId) {
    return this.request(`/videos/${videoId}`);
  }

  async generatePuzzleCheck(videoId, endTime) {
    return this.request(`/puzzel-checks?videoId=${videoId}&endTime=${endTime}`);
  }

  async createTranscript(videoId) {
    return this.request('/transcripts', {
      method: 'POST',
      body: JSON.stringify({ videoId })
    });
  }
}

// Usage
const api = new UnpuzzleAPI('http://localhost:3001/api', 'your-token');
const video = await api.getVideo('video_123');
```

### Python

```python
import requests

class UnpuzzleAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def request(self, endpoint, method='GET', data=None):
        url = f"{self.base_url}{endpoint}"
        response = requests.request(
            method=method,
            url=url,
            headers=self.headers,
            json=data
        )
        response.raise_for_status()
        return response.json()
    
    def get_video(self, video_id):
        return self.request(f'/videos/{video_id}')
    
    def generate_puzzle_check(self, video_id, end_time):
        return self.request(f'/puzzel-checks?videoId={video_id}&endTime={end_time}')
    
    def create_transcript(self, video_id):
        return self.request('/transcripts', method='POST', data={'videoId': video_id})

# Usage
api = UnpuzzleAPI('http://localhost:3001/api', 'your-token')
video = api.get_video('video_123')
```

---

## Support

For API support and questions:

- **Documentation**: Check this documentation first
- **Issues**: Create an issue in the repository
- **Email**: api-support@unpuzzle.com
- **Discord**: Join our developer community

---

**Last Updated**: January 2024
**API Version**: 1.0.0 