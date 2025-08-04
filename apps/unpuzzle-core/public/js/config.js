// Backend configuration
window.BACKEND_URL = window.ASSET_ORIGIN || 'https://dev.nazmulcodes.org';

// Socket.IO configuration - use server-provided URL or fallback to BACKEND_URL
window.SOCKET_URL = window.SOCKET_IO_URL || window.BACKEND_URL;