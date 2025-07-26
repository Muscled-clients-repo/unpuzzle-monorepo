#!/bin/bash

# Deploy script for Vercel monorepo deployment

echo "🚀 Deploying Unpuzzle Monorepo to Vercel"

# Function to deploy an app
deploy_app() {
    local app_name=$1
    local app_path=$2
    local base_path=$3
    
    echo "📦 Deploying $app_name..."
    
    cd "$app_path" || exit
    
    if [ -n "$base_path" ]; then
        NEXT_PUBLIC_BASE_PATH="$base_path" vercel --prod
    else
        vercel --prod
    fi
    
    cd - || exit
}

# Deploy each app
deploy_app "Client App" "apps/client" ""
deploy_app "Instructor App" "apps/instructor" "/instructor"
deploy_app "Student App" "apps/student" "/student"

echo "✅ All apps deployed successfully!"