#!/bin/bash

echo "🧪 Testing local builds for all apps..."

# Test Client App
echo "📱 Building Client App..."
cd apps/client
if npm ci && npm run build; then
    echo "✅ Client app builds successfully"
else
    echo "❌ Client app build failed"
    exit 1
fi
cd ../..

# Test Student App
echo "🎓 Building Student App..."
cd apps/student
if npm ci && npm run build; then
    echo "✅ Student app builds successfully"
else
    echo "❌ Student app build failed"
    exit 1
fi
cd ../..

# Test Instructor App
echo "👨‍🏫 Building Instructor App..."
cd apps/instructor
if npm ci && npm run build; then
    echo "✅ Instructor app builds successfully"
else
    echo "❌ Instructor app build failed"
    exit 1
fi
cd ../..

echo "🎉 All apps build successfully!"
echo "Ready for Render deployment!"