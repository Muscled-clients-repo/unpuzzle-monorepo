# Socket.IO Configuration Guide

## Overview

This application uses Socket.IO for real-time streaming of AI-generated hints. The configuration has been designed to work with proxy setups like Vercel rewrites.

## Environment Variables

### `SOCKET_IO_URL`
**Required for production deployments with proxies/rewrites**

- **Purpose**: Specifies the direct URL to your Socket.IO server
- **Default**: Falls back to `CLIENT_URL_ENDPOINT` if not set
- **Example**: `https://core.nazmulcodes.org`

### Configuration Examples

#### Development
```env
SOCKET_IO_URL="http://localhost:3001"
CLIENT_URL_ENDPOINT="http://localhost:3001"
```

#### Production with Direct Domain
```env
SOCKET_IO_URL="https://api.yourapp.com"
CLIENT_URL_ENDPOINT="https://api.yourapp.com"
```

#### Production with Vercel Rewrites/Proxy
```env
SOCKET_IO_URL="https://core.nazmulcodes.org"  # Direct backend server
CLIENT_URL_ENDPOINT="https://nazmulcodes.org"  # Frontend domain (proxied)
ROOT_APP_URL="https://nazmulcodes.org"
```

## How It Works

1. **Server Configuration**: The server reads `SOCKET_IO_URL` from environment variables
2. **Frontend Injection**: The server injects this URL into the frontend via Pug templates
3. **Client Connection**: JavaScript connects to the specified Socket.IO URL

## File Structure

- **Backend**: `index.ts` - Server configuration and environment variable handling
- **Frontend**: `views/layout/main.pug` - Injects Socket.IO URL into browser
- **Client**: `public/js/config.js` - Configures Socket.IO connection URL
- **Usage**: `public/js/core/puzzle-hint.js` - Uses configured URL for connections

## Troubleshooting

### Connection Issues
1. Check that `SOCKET_IO_URL` points to your actual backend server
2. Verify CORS settings include both your frontend and Socket.IO domains
3. Check browser console for connection errors

### Proxy/Rewrite Issues
- Socket.IO connections bypass proxies and connect directly to the backend
- Ensure your backend server is publicly accessible at the `SOCKET_IO_URL`
- Regular API calls can still use the proxied domain

## Security Notes

- Socket.IO connections use CORS validation
- Credentials are included in requests (`withCredentials: true`)
- Both WebSocket and polling transports are supported for reliability