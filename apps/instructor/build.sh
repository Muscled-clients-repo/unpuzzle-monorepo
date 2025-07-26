#!/bin/bash

# Clean previous builds
rm -rf .next

# Set environment
export NODE_ENV=production

# Build the app
echo "Building Next.js app..."
npx next build

# Check if build succeeded
if [ -d ".next" ]; then
    echo "Build completed successfully"
    
    # Create BUILD_ID if missing
    if [ ! -f ".next/BUILD_ID" ]; then
        echo "Creating BUILD_ID..."
        echo "$(date +%s)" > .next/BUILD_ID
    fi
    
    # Create routes-manifest.json if missing
    if [ ! -f ".next/routes-manifest.json" ]; then
        echo "Creating routes-manifest.json..."
        echo '{"version": 3, "pages404": true, "basePath": "", "redirects": [], "headers": [], "dynamicRoutes": [], "staticRoutes": [], "dataRoutes": [], "rsc": {"header": "RSC", "varyHeader": "RSC, Next-Router-State-Tree, Next-Router-Prefetch"}}' > .next/routes-manifest.json
    fi
    
    echo "Build artifacts ready"
else
    echo "Build failed"
    exit 1
fi