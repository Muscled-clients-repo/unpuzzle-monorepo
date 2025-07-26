#!/usr/bin/env node

const port = process.env.PORT || '3000';
const hostname = '0.0.0.0';

console.log(`Starting server on port ${port}`);

// Handle SIGTERM gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

// Handle SIGINT gracefully
process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Set environment variables
process.env.PORT = port;
process.env.HOSTNAME = hostname;

// Start the standalone server
require('./.next/standalone/server.js');