-- Fix null cardName values in the database
UPDATE cards 
SET card_name = CONCAT('Card-', id)
WHERE card_name IS NULL;

-- Verify the fix
SELECT id, card_name, full_name FROM cards WHERE card_name IS NULL;
