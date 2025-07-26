#!/usr/bin/env node

// Simple server starter for Railway
const fs = require('fs');
const path = require('path');

console.log('=== Railway Server Startup ===');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());
console.log('Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- HOSTNAME:', process.env.HOSTNAME);

// Set default values
const port = process.env.PORT || '3000';
const hostname = process.env.HOSTNAME || '0.0.0.0';

process.env.PORT = port;
process.env.HOSTNAME = hostname;

console.log(`Starting on ${hostname}:${port}`);

try {
  // List current directory
  console.log('Files in current directory:');
  const files = fs.readdirSync('.');
  files.forEach(file => {
    const stats = fs.statSync(file);
    console.log(`  ${file} (${stats.isDirectory() ? 'dir' : 'file'})`);
  });

  // Check for .next directory
  if (fs.existsSync('.next')) {
    console.log('Found .next directory');
    const nextFiles = fs.readdirSync('.next');
    console.log('.next contents:', nextFiles);
    
    // Try standalone server first
    const standalonePath = path.join('.next', 'standalone', 'server.js');
    if (fs.existsSync(standalonePath)) {
      console.log('Using Next.js standalone server');
      require(standalonePath);
      return;
    }
  }

  // Fallback to regular Next.js server
  console.log('Starting Next.js in production mode');
  const { createServer } = require('http');
  const next = require('next');
  
  const app = next({ 
    dev: false,
    dir: process.cwd()
  });
  
  const handle = app.getRequestHandler();
  
  app.prepare().then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(port, hostname, (err) => {
      if (err) throw err;
      console.log(`✓ Server ready on http://${hostname}:${port}`);
    });
  });

} catch (error) {
  console.error('Failed to start server:', error);
  console.error(error.stack);
  process.exit(1);
}