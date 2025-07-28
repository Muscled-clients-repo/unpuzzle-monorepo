#!/bin/bash

# This script updates all Redux services to use the API configuration

echo "Updating Redux services to use API configuration..."

# List of files to update
services=(
  "app/redux/services/scripts.services.ts"
  "app/redux/services/quizzes.services.ts"
  "app/redux/services/video.services.ts"
  "app/redux/services/permission.services.ts"
  "app/redux/services/puzzleSolutions.services.ts"
)

# Update each service file
for service in "${services[@]}"; do
  echo "Updating $service..."
  
  # Add import statement if not present
  if ! grep -q "import { API_ENDPOINTS }" "$service"; then
    sed -i "1s/^/import { API_ENDPOINTS } from '..\/..\/config\/api.config';\n/" "$service"
  fi
  
  # Replace hardcoded URLs
  sed -i "s|baseUrl: 'http://localhost:3001/api'|baseUrl: API_ENDPOINTS.BASE|g" "$service"
  sed -i "s|baseUrl: 'http://localhost:3001/api/'|baseUrl: API_ENDPOINTS.BASE + '/'|g" "$service"
  sed -i "s|baseUrl: \"http://localhost:3001/api\"|baseUrl: API_ENDPOINTS.BASE|g" "$service"
done

# Handle special cases for services with BASE_URL constants
echo "Updating services with BASE_URL constants..."

# Update userPermission.services.ts
echo "Updating app/redux/services/userPermission.services.ts..."
sed -i "s|const BASE_URL = 'http://localhost:3001';|import { API_BASE_URL } from '../../config/api.config';\nconst BASE_URL = API_BASE_URL;|" "app/redux/services/userPermission.services.ts"

# Update user.services.ts
echo "Updating app/redux/services/user.services.ts..."
sed -i "s|const BASE_URL = 'http://localhost:3001';|import { API_BASE_URL } from '../../config/api.config';\nconst BASE_URL = API_BASE_URL;|" "app/redux/services/user.services.ts"

# Update useSocket.ts hook
echo "Updating app/hooks/useSocket.ts..."
sed -i "s|url = \"http://localhost:3001\"|url = SOCKET_URL|" "app/hooks/useSocket.ts"
# Add import if not present
if ! grep -q "import { SOCKET_URL }" "app/hooks/useSocket.ts"; then
  sed -i "1s/^/import { SOCKET_URL } from '..\/config\/api.config';\n/" "app/hooks/useSocket.ts"
fi

echo "All Redux services have been updated!"
echo ""
echo "Please review the changes and ensure:"
echo "1. All imports are correctly placed"
echo "2. The API endpoints match your backend structure"
echo "3. Run 'npm run build' to verify there are no errors"