// Set the PORT for the standalone server
process.env.PORT = process.env.PORT || '3000';
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0';

console.log(`Starting server on port ${process.env.PORT}`);

// Run the standalone server
require('./.next/standalone/server.js');