-- Manual migration to add cardActive field to cards table
-- Run this SQL directly on your production database

-- Add cardActive column
ALTER TABLE cards 
ADD COLUMN card_active BOOLEAN NOT NULL DEFAULT TRUE
AFTER card_name;

-- Verify the column was added
DESCRIBE cards;

-- Optional: Update existing cards to be active
UPDATE cards SET card_active = TRUE WHERE card_active IS NULL;
