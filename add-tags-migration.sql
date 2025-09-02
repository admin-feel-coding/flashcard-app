-- Add tags column to decks table
ALTER TABLE public.decks ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create index for tags array for better search performance
CREATE INDEX IF NOT EXISTS idx_decks_tags ON public.decks USING GIN (tags);

-- Create a function to get all unique tags for a user
CREATE OR REPLACE FUNCTION get_user_tags(user_uuid UUID)
RETURNS TEXT[] AS $$
DECLARE
    result TEXT[];
BEGIN
    SELECT ARRAY(
        SELECT DISTINCT unnest(tags)
        FROM public.decks
        WHERE user_id = user_uuid
        AND tags IS NOT NULL
        ORDER BY unnest(tags)
    ) INTO result;
    
    RETURN COALESCE(result, '{}');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to search decks by tags
CREATE OR REPLACE FUNCTION search_decks_by_tags(user_uuid UUID, search_tags TEXT[])
RETURNS SETOF public.decks AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.decks
    WHERE user_id = user_uuid
    AND (search_tags <@ tags OR tags && search_tags)
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;