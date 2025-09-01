-- Execute the main table creation script
\i scripts/001_create_tables.sql

-- Execute the profile trigger setup
\i scripts/002_profile_trigger.sql

-- Verify tables were created successfully
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'decks', 'cards', 'study_sessions');
