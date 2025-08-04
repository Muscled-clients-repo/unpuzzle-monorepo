# API Quick Reference - Unpuzzle

## Base URL
```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Authentication
```http
Authorization: Bearer <user_token>
```

---

## 📋 Endpoints Summary

### Health & Status
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check API health |

### Videos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/videos/:videoId` | Get video by ID |
| POST | `/videos/:videoId/chapters/:chapterId` | Create video from YouTube |

### Transcripts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transcripts?videoId=:videoId` | Get video transcripts |
| POST | `/transcripts` | Create transcript from YouTube |
| POST | `/transcripts/upload` | Upload SRT file |

### Puzzle Checks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/puzzel-checks?videoId=:videoId&endTime=:endTime` | Generate puzzle check |

### Puzzle Hints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/puzzle-hint?videoId=:videoId&startTime=:startTime` | Get puzzle hint |
| POST | `/puzzle-hint` | Generate puzzle hint |

### Puzzle Paths
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/puzzel-path?videoId=:videoId&currentTime=:currentTime` | Get learning path |
| POST | `/puzzel-path` | Create learning path |

### Puzzle Reflections
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/puzzel-reflects` | Generate reflection |
| POST | `/puzzel-reflects/loom-link` | Create reflection from Loom |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get product by ID |
| POST | `/products` | Create product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create order |

### Activity Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/activity-logs` | Get all activity logs |
| GET | `/activity-logs/:id` | Get activity log by ID |
| GET | `/activity-logs/user/:userId` | Get user activity logs |
| POST | `/activity-logs` | Create activity log |
| PUT | `/activity-logs/:id` | Update activity log |
| DELETE | `/activity-logs/:id` | Delete activity log |

### Video Processing (Mux)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/mux/upload` | Upload video to Mux |
| GET | `/mux/playback/:id` | Get playback info |
| GET | `/mux/status/:id` | Get video status |
| DELETE | `/mux/:id` | Delete video |

### AI Services (Whisper)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/whisper/transcribe` | Transcribe audio |
| GET | `/whisper/status/:id` | Get transcription status |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhook/clerk` | Clerk authentication events |
| POST | `/webhook/stripe` | Stripe payment events |

---

## 🔧 Common Request Examples

### Create Video from YouTube
```bash
curl -X POST "http://localhost:3001/api/videos/abc123/chapters/chapter456" \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json"
```

### Generate Puzzle Check
```bash
curl -X GET "http://localhost:3001/api/puzzel-checks?videoId=video123&endTime=300" \
  -H "Authorization: Bearer your_token"
```

### Upload Transcript File
```bash
curl -X POST "http://localhost:3001/api/transcripts/upload" \
  -H "Authorization: Bearer your_token" \
  -F "srtFile=@transcript.srt" \
  -F "videoId=video123"
```

### Create Product
```bash
curl -X POST "http://localhost:3001/api/products" \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript Course",
    "description": "Learn JavaScript basics",
    "price": 99.99,
    "currency": "USD"
  }'
```

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Internal Server Error |

---

## 📝 Common Parameters

### Query Parameters
- `videoId` (string): Video identifier
- `startTime` (number): Start time in seconds
- `endTime` (number): End time in seconds
- `currentTime` (number): Current time in seconds
- `page` (number): Page number for pagination
- `limit` (number): Items per page (max: 100)

### Path Parameters
- `:id` (string): Resource identifier
- `:videoId` (string): Video identifier
- `:chapterId` (string): Chapter identifier
- `:userId` (string): User identifier

---

## 🔐 Authentication Scopes

| Endpoint | Required Scope |
|----------|----------------|
| `/videos/*` | `videos:read` |
| `/transcripts/*` | `transcripts:read` |
| `/puzzel-*` | `puzzles:read` |
| `/products/*` | `products:read` |
| `/orders/*` | `orders:write` |
| `/activity-logs/*` | `activity:read` |

---

## ⚡ Rate Limits

| User Type | Requests/Hour |
|-----------|---------------|
| Authenticated | 1000 |
| Unauthenticated | 100 |

Rate limit headers:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## 🔄 WebSocket Events

| Event | Description | Data |
|-------|-------------|------|
| `puzzle_generated` | New puzzle created | `{ videoId, puzzle }` |
| `transcript_ready` | Transcript processing complete | `{ videoId, transcript }` |
| `user_activity` | User activity logged | `{ userId, activity }` |

---

## 📞 Support

- **Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Issues**: GitHub Issues
- **Email**: api-support@unpuzzle.com

---

**Last Updated**: January 2024
**API Version**: 1.0.0 