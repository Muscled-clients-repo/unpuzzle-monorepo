#!/usr/bin/env node
const { spawn } = require('child_process');

const port = process.env.PORT || '3000';
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log(`Starting server on port ${port}`);

// Set environment variables for the standalone server
process.env.PORT = port;
process.env.HOSTNAME = hostname;

// Start the standalone server as a child process
const server = spawn('node', ['.next/standalone/server.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: port,
    HOSTNAME: hostname
  }
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  process.exit(code);
});