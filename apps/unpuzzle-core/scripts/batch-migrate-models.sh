#!/bin/bash

# Batch migration script for models
# This script backs up and replaces models with new BaseModel versions

echo "Starting batch model migration..."

# Create backups directory
mkdir -p models/supabase/backups

# List of models to migrate (excluding user.model.ts as it's already done)
models=(
  "video.ts"
  "chapter.model.ts"
)

for model in "${models[@]}"
do
  echo "Processing $model..."
  
  # Check if file exists
  if [ -f "models/supabase/$model" ]; then
    # Create backup
    cp "models/supabase/$model" "models/supabase/backups/$model.backup"
    echo "  ✅ Backed up $model"
    
    # Check if new version exists
    newModel="${model%.ts}.new.ts"
    if [ -f "models/supabase/$newModel" ]; then
      # Replace with new version
      mv "models/supabase/$newModel" "models/supabase/$model"
      echo "  ✅ Migrated $model"
    else
      echo "  ⚠️  No new version found for $model"
    fi
  else
    echo "  ❌ $model not found"
  fi
done

echo "Migration complete!"