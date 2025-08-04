-- Migration to add user_id column to puzzle-related tables
-- Run these commands in your Supabase SQL editor

-- Add user_id to puzzlechecks table
ALTER TABLE puzzlechecks 
ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT '';

-- Add user_id to puzzlepaths table  
ALTER TABLE puzzlepaths
ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT '';

-- Add user_id to puzzlehints table
ALTER TABLE puzzlehints
ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT '';

-- Note: puzzlereflects already has user_id column based on the code analysis

-- Optional: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_puzzlechecks_user_id ON puzzlechecks(user_id);
CREATE INDEX IF NOT EXISTS idx_puzzlepaths_user_id ON puzzlepaths(user_id);
CREATE INDEX IF NOT EXISTS idx_puzzlehints_user_id ON puzzlehints(user_id);

-- Optional: Add foreign key constraints if you have a users table
-- ALTER TABLE puzzlechecks ADD CONSTRAINT fk_puzzlechecks_user_id FOREIGN KEY (user_id) REFERENCES users(id);
-- ALTER TABLE puzzlepaths ADD CONSTRAINT fk_puzzlepaths_user_id FOREIGN KEY (user_id) REFERENCES users(id);
-- ALTER TABLE puzzlehints ADD CONSTRAINT fk_puzzlehints_user_id FOREIGN KEY (user_id) REFERENCES users(id);