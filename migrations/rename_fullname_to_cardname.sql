-- Migration: Rename full_name to card_name in cards table
-- This consolidates the card identifier into a single field

-- Step 1: Rename the column
ALTER TABLE cards 
CHANGE COLUMN full_name card_name VARCHAR(255) NOT NULL;

-- Step 2: Verify the change
DESCRIBE cards;

-- Note: The card_name column now stores the main card identifier
-- The individual name fields (firstName, lastName, etc.) remain as optional detailed information
