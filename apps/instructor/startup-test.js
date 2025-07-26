// Simple startup test for debugging
console.log('=== STARTUP TEST ===');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Current directory:', process.cwd());
console.log('Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);

// Test if we can create a simple server
const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Railway!\n');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`✓ Test server running on port ${port}`);
});

// Keep alive for 30 seconds then exit
setTimeout(() => {
  console.log('Test completed, shutting down');
  process.exit(0);
}, 30000);