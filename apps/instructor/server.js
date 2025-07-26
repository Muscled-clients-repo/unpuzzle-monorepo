// Custom server for Railway deployment
const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = '0.0.0.0';

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit on uncaught exceptions
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit on unhandled rejections
});

// Import and start the standalone server
try {
  process.env.PORT = String(port);
  process.env.HOSTNAME = hostname;
  
  console.log(`Starting Next.js standalone server on port ${port}`);
  
  // Run the standalone server
  require('./.next/standalone/server.js');
  
  console.log(`Server is running on http://${hostname}:${port}`);
} catch (error) {
  console.error('Failed to start server:', error);
  // Keep the process alive
  setInterval(() => {
    console.log('Server heartbeat - keeping process alive');
  }, 30000);
}

// Graceful shutdown
let isShuttingDown = false;

const gracefulShutdown = (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log(`\n${signal} received. Performing graceful shutdown...`);
  
  // Give the server time to finish ongoing requests
  setTimeout(() => {
    console.log('Graceful shutdown complete');
    process.exit(0);
  }, 5000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));