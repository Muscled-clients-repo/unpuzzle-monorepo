# Video Chunk Upload API

This document describes the video chunk upload functionality implemented in the M1 server.

## Endpoints

### POST `/api/video/upload`
Uploads a video chunk to the server.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `file`: Video chunk file (Blob)
  - `fileId`: Unique identifier for the video upload
  - `chunkIndex`: Index of the current chunk (0-based)
  - `status`: Upload status ("uploading" or "completed")

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Video chunk uploaded successfully",
    "fileId": "upload_1234567890_abc123",
    "chunkIndex": 0,
    "status": "uploading"
  }
}
```

### GET `/api/video/status/:fileId`
Get the upload status for a specific file.

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "upload_1234567890_abc123",
    "exists": true,
    "fileSize": 1048576,
    "lastModified": "2024-01-01T00:00:00.000Z"
  }
}
```

## How it Works

1. **Chunked Upload**: The client records video in chunks and uploads each chunk separately
2. **File Appending**: Each chunk is appended to a single file on the server
3. **Progress Tracking**: The client tracks upload progress and displays it to the user
4. **Completion**: When the last chunk is uploaded with status "completed", the upload is finalized

## File Storage

- Uploaded files are stored in the `uploads/` directory
- Files are named using the `fileId` with `.webm` extension
- Temporary chunk files are stored in `uploads/temp/` and cleaned up after processing

## Environment Variables

Make sure to set the following environment variable in your client:

```
NEXT_PUBLIC_M1_SERVER_URL=http://localhost:3001
```

## Usage Example

The client automatically uploads video chunks when recording stops. The upload process:

1. Starts recording and collects video chunks
2. When recording stops, uploads all chunks sequentially
3. Shows upload progress to the user
4. Displays success/error messages

## Future Enhancements

- Cloud storage integration (AWS S3, Google Cloud Storage, etc.)
- Database integration for file metadata
- Real-time upload progress via WebSocket
- Video processing and compression
- Authentication and authorization 