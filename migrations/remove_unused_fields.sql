-- Migration to remove unused fields from cards and users tables
-- Run this SQL directly on your production database

-- Remove unused fields from cards table
ALTER TABLE cards 
DROP COLUMN preferred_name,
DROP COLUMN maiden_name,
DROP COLUMN pronouns,
DROP COLUMN department,
DROP COLUMN affiliation,
DROP COLUMN headline,
DROP COLUMN accreditations,
DROP COLUMN email_link,
DROP COLUMN phone_link;

-- Remove unused fields from users table  
ALTER TABLE users
DROP COLUMN preferredName,
DROP COLUMN maidenName,
DROP COLUMN pronouns,
DROP COLUMN department,
DROP COLUMN affiliation,
DROP COLUMN headline,
DROP COLUMN accreditations,
DROP COLUMN emailLink,
DROP COLUMN phoneLink;

-- Verify the columns were removed
DESCRIBE cards;
DESCRIBE users;
