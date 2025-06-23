-- Migration: Add favorite table for meal favorites functionality
-- Created: 2025-06-23
-- Description: Creates favorite table with proper foreign key constraints and indexes

-- Create favorite table
CREATE TABLE IF NOT EXISTS favorite (
    favorite_id SERIAL PRIMARY KEY,
    meal_id INTEGER NOT NULL REFERENCES inventory(meal_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES account(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(meal_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_favorite_user_id ON favorite(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_meal_id ON favorite(meal_id);
CREATE INDEX IF NOT EXISTS idx_favorite_user_meal ON favorite(user_id, meal_id);
CREATE INDEX IF NOT EXISTS idx_favorite_created_at ON favorite(created_at DESC);

-- Add comment to table
COMMENT ON TABLE favorite IS 'User favorite meals - many-to-many relationship between users and meals';
COMMENT ON COLUMN favorite.favorite_id IS 'Primary key for favorite record';
COMMENT ON COLUMN favorite.meal_id IS 'Foreign key to inventory table';
COMMENT ON COLUMN favorite.user_id IS 'Foreign key to account table';
COMMENT ON COLUMN favorite.created_at IS 'Timestamp when favorite was added';
