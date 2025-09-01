-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create decks table for flashcard collections
CREATE TABLE IF NOT EXISTS public.decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cards table for individual flashcards
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study_sessions table for tracking learning progress
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  difficulty INTEGER NOT NULL DEFAULT 0, -- 0: again, 1: hard, 2: good, 3: easy
  interval_days INTEGER NOT NULL DEFAULT 1,
  ease_factor DECIMAL(3,2) NOT NULL DEFAULT 2.50,
  repetitions INTEGER NOT NULL DEFAULT 0,
  next_review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for decks
CREATE POLICY "decks_select_own" ON public.decks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "decks_insert_own" ON public.decks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "decks_update_own" ON public.decks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "decks_delete_own" ON public.decks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for cards (access through deck ownership)
CREATE POLICY "cards_select_own" ON public.cards FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.decks WHERE decks.id = cards.deck_id AND decks.user_id = auth.uid()));
CREATE POLICY "cards_insert_own" ON public.cards FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.decks WHERE decks.id = cards.deck_id AND decks.user_id = auth.uid()));
CREATE POLICY "cards_update_own" ON public.cards FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.decks WHERE decks.id = cards.deck_id AND decks.user_id = auth.uid()));
CREATE POLICY "cards_delete_own" ON public.cards FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.decks WHERE decks.id = cards.deck_id AND decks.user_id = auth.uid()));

-- RLS Policies for study_sessions
CREATE POLICY "study_sessions_select_own" ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "study_sessions_insert_own" ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "study_sessions_update_own" ON public.study_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "study_sessions_delete_own" ON public.study_sessions FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_decks_user_id ON public.decks(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON public.cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_card_id ON public.study_sessions(card_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_next_review ON public.study_sessions(next_review_date);
