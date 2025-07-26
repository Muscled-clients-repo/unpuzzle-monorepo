// Railway deployment server
const fs = require('fs');
const path = require('path');

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log(`Starting server on ${hostname}:${port}`);
console.log('Current directory:', process.cwd());
console.log('Directory contents:', fs.readdirSync('.'));

// Check if .next/standalone exists
const standalonePath = './.next/standalone';
if (fs.existsSync(standalonePath)) {
  console.log('Found .next/standalone directory');
  console.log('Standalone contents:', fs.readdirSync(standalonePath));
  
  const serverPath = path.join(standalonePath, 'server.js');
  if (fs.existsSync(serverPath)) {
    console.log('Found standalone server.js, starting...');
    
    // Set environment variables for the standalone server
    process.env.PORT = String(port);
    process.env.HOSTNAME = hostname;
    
    // Start the Next.js standalone server
    require(serverPath);
  } else {
    console.error('standalone/server.js not found');
    process.exit(1);
  }
} else {
  console.error('.next/standalone directory not found');
  console.log('Available files:', fs.readdirSync('.', { withFileTypes: true }));
  process.exit(1);
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});