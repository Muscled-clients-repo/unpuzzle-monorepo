-- Migration: Add timestamp field to puzzlereflects table and status enum to puzzlehints table
-- Date: 2024-01-25
-- Description: 
--   1. Adds timestamp field to puzzlereflects table to store video time in seconds
--   2. Adds status enum field to puzzlehints table to track user's understanding

-- Add timestamp column to puzzlereflects table
ALTER TABLE puzzlereflects 
ADD COLUMN IF NOT EXISTS timestamp NUMERIC NULL;

-- Add comment to explain the field
COMMENT ON COLUMN puzzlereflects.timestamp IS 'Video timestamp in seconds where the reflection was created';

-- Create enum type for puzzle hint status if it doesn't exist
DO $$ BEGIN
    CREATE TYPE puzzle_hint_status AS ENUM ('still confused', 'got it');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add status column to puzzlehints table
ALTER TABLE puzzlehints 
ADD COLUMN IF NOT EXISTS status puzzle_hint_status NULL;

-- Add comment to explain the field
COMMENT ON COLUMN puzzlehints.status IS 'User feedback on whether they understood the hint';

-- Optional: Add indexes if needed for performance
-- CREATE INDEX idx_puzzlereflects_timestamp ON puzzlereflects(timestamp);
-- CREATE INDEX idx_puzzlehints_status ON puzzlehints(status);