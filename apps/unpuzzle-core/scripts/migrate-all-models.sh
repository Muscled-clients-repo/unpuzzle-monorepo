#!/bin/bash

# Comprehensive batch migration script for all models
# This script backs up and replaces all models with new BaseModel versions

echo "Starting comprehensive model migration..."

# Create backups directory
mkdir -p models/supabase/backups

# List of all models to migrate
models=(
  "activityLogs.model.ts"
  "agent.model.ts"
  "course.model.ts"
  "creditTrack.model.ts"
  "enrollment.model.ts"
  "file.model.ts"
  "meeting.model.ts"
  "orders.model.ts"
  "product.model.ts"
  "puzzleCheck.model.ts"
  "puzzleHint.model.ts"
  "puzzlePath.model.ts"
  "puzzleReflect.model.ts"
  "puzzleRequest.model.ts"
  "relatedVideo.model.ts"
  "transcript.ts"
)

# Count successful migrations
success_count=0
total_count=${#models[@]}

for model in "${models[@]}"
do
  echo "Processing $model..."
  
  # Check if file exists
  if [ -f "models/supabase/$model" ]; then
    # Create backup
    if [ ! -f "models/supabase/backups/$model.backup" ]; then
      cp "models/supabase/$model" "models/supabase/backups/$model.backup"
      echo "  ✅ Backed up $model"
    else
      echo "  ℹ️  Backup already exists for $model"
    fi
    
    # Check if new version exists
    newModel="${model%.ts}.new.ts"
    if [ -f "models/supabase/$newModel" ]; then
      # Replace with new version
      mv "models/supabase/$newModel" "models/supabase/$model"
      echo "  ✅ Migrated $model"
      ((success_count++))
    else
      echo "  ⚠️  No new version found for $model"
    fi
  else
    echo "  ❌ $model not found"
  fi
  echo ""
done

echo "=================================="
echo "Migration Summary:"
echo "  Total models: $total_count"
echo "  Successfully migrated: $success_count"
echo "  Already migrated: 3 (user, video, chapter)"
echo "=================================="

if [ $success_count -eq $total_count ]; then
  echo "✅ All models successfully migrated!"
else
  echo "⚠️  Some models were not migrated. Check the output above."
fi