#!/bin/bash

# Check if .next directory exists
if [ ! -d ".next" ]; then
    echo "Error: .next directory not found. Please run 'npm run build' first."
    exit 1
fi

# Check if standalone mode is available
if [ -f ".next/standalone/server.js" ]; then
    echo "Starting in standalone mode..."
    PORT=${PORT:-3000} node .next/standalone/server.js
else
    echo "Starting in regular mode..."
    PORT=${PORT:-3000} npx next start
fi