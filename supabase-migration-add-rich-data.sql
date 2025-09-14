-- Migration to add rich card data support
-- This adds a JSONB column to store all the rich learning data

-- Add rich_data column to cards table
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS rich_data JSONB DEFAULT '{}';

-- Add tags column for card-level tags
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Add index for rich_data queries
CREATE INDEX IF NOT EXISTS idx_cards_rich_data ON public.cards USING gin(rich_data);

-- Add index for tags queries  
CREATE INDEX IF NOT EXISTS idx_cards_tags ON public.cards USING gin(tags);

-- Example of rich_data structure:
/*
rich_data will contain:
{
  "translation": "Spanish translation",
  "pronunciation": "/pronunciation/", 
  "wordType": "noun",
  "examples": [
    {"text": "Example sentence", "translation": "Translated example"},
    {"text": "Another example", "translation": "Another translation"}
  ],
  "grammarNotes": "Grammar explanation",
  "usageNotes": "Usage notes",
  "mnemonicHint": "Memory tip",
  "culturalContext": "Cultural context",
  "relatedWords": ["word1", "word2"],
  "synonyms": ["synonym1", "synonym2"], 
  "antonyms": ["antonym1"],
  "conjugations": {"present": "form1", "past": "form2"},
  "difficulty": "beginner/intermediate/advanced"
}
*/