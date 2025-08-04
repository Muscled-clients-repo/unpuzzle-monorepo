#!/bin/bash

# Batch migration script for controllers
# This script backs up and replaces controllers with optimized versions

echo "Starting controller migration..."

# Create backups directory
mkdir -p protocols/controllers/api/backups

# List of controllers to migrate
controllers=(
  "activityLogs.controller.ts"
  "chapter.controller.ts"
  "product.controller.ts"
  "creditTrack.controller.ts"
)

# Function to migrate a controller
migrate_controller() {
  local controller=$1
  echo "Processing $controller..."
  
  # Check if file exists
  if [ -f "protocols/controllers/api/$controller" ]; then
    # Create backup if not exists
    if [ ! -f "protocols/controllers/api/backups/$controller.backup" ]; then
      cp "protocols/controllers/api/$controller" "protocols/controllers/api/backups/$controller.backup"
      echo "  ✅ Backed up $controller"
    fi
    
    # Check if new version exists
    newController="${controller%.ts}.new.ts"
    if [ -f "protocols/controllers/api/$newController" ]; then
      # Replace with new version
      mv "protocols/controllers/api/$newController" "protocols/controllers/api/$controller"
      echo "  ✅ Migrated $controller"
    else
      echo "  ⚠️  No new version found for $controller"
    fi
  else
    echo "  ❌ $controller not found"
  fi
}

# Migrate already created controllers
for controller in "${controllers[@]}"
do
  if [ -f "protocols/controllers/api/${controller%.ts}.new.ts" ]; then
    migrate_controller "$controller"
  fi
done

echo "Migration complete!"