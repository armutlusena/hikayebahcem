/*
  # Hikaye Bahçem - EdTech Platform Schema

  ## Overview
  Complete database schema for the Hikaye Bahçem dyslexia learning platform.
  
  ## New Tables
  
  ### 1. profiles
  Stores child user profiles and personalization settings
  - `id` (uuid, references auth.users)
  - `full_name` (text)
  - `age` (int)
  - `reading_level` (int, 1-10)
  - `font_size` (int, default 18)
  - `background_color` (text, default #FFF9E6)
  - `line_spacing` (decimal, default 1.8)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. assessments
  Stores initial assessment results
  - `id` (uuid)
  - `user_id` (uuid, references profiles)
  - `attention_score` (int, 0-100)
  - `discrimination_score` (int, 0-100)
  - `processing_speed` (int, 0-100)
  - `reading_level` (int, 1-10)
  - `completed_at` (timestamptz)
  
  ### 3. activities
  Library of attention activities (warm-up exercises)
  - `id` (uuid)
  - `title` (text)
  - `type` (text: word_search, spot_difference, etc.)
  - `difficulty` (int, 1-5)
  - `content` (jsonb)
  - `duration_minutes` (int)
  - `created_at` (timestamptz)
  
  ### 4. reading_sessions
  Tracks each reading session with NLP analysis
  - `id` (uuid)
  - `user_id` (uuid)
  - `text_content` (text)
  - `reading_speed_wpm` (decimal)
  - `accuracy_percentage` (decimal)
  - `pause_count` (int)
  - `error_words` (jsonb)
  - `duration_seconds` (int)
  - `completed_at` (timestamptz)
  
  ### 5. badges
  Badge/achievement definitions
  - `id` (uuid)
  - `name` (text)
  - `description` (text)
  - `icon` (text)
  - `criteria` (jsonb)
  - `created_at` (timestamptz)
  
  ### 6. user_badges
  Junction table for user earned badges
  - `id` (uuid)
  - `user_id` (uuid)
  - `badge_id` (uuid)
  - `earned_at` (timestamptz)
  
  ### 7. reading_progress
  Tracks overall reading progress metrics
  - `id` (uuid)
  - `user_id` (uuid)
  - `total_sessions` (int)
  - `total_words_read` (int)
  - `average_accuracy` (decimal)
  - `current_streak_days` (int)
  - `updated_at` (timestamptz)
  
  ### 8. activity_completions
  Tracks completed warm-up activities
  - `id` (uuid)
  - `user_id` (uuid)
  - `activity_id` (uuid)
  - `score` (int)
  - `completed_at` (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Authenticated users required for all operations
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  age int NOT NULL CHECK (age >= 7 AND age <= 13),
  reading_level int DEFAULT 1 CHECK (reading_level >= 1 AND reading_level <= 10),
  font_size int DEFAULT 18 CHECK (font_size >= 14 AND font_size <= 28),
  background_color text DEFAULT '#FFF9E6',
  line_spacing decimal DEFAULT 1.8 CHECK (line_spacing >= 1.0 AND line_spacing <= 3.0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  attention_score int CHECK (attention_score >= 0 AND attention_score <= 100),
  discrimination_score int CHECK (discrimination_score >= 0 AND discrimination_score <= 100),
  processing_speed int CHECK (processing_speed >= 0 AND processing_speed <= 100),
  reading_level int CHECK (reading_level >= 1 AND reading_level <= 10),
  completed_at timestamptz DEFAULT now()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  difficulty int NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  content jsonb NOT NULL,
  duration_minutes int DEFAULT 3,
  created_at timestamptz DEFAULT now()
);

-- Create reading_sessions table
CREATE TABLE IF NOT EXISTS reading_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text_content text NOT NULL,
  reading_speed_wpm decimal,
  accuracy_percentage decimal CHECK (accuracy_percentage >= 0 AND accuracy_percentage <= 100),
  pause_count int DEFAULT 0,
  error_words jsonb DEFAULT '[]'::jsonb,
  duration_seconds int,
  completed_at timestamptz DEFAULT now()
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text NOT NULL,
  criteria jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create reading_progress table
CREATE TABLE IF NOT EXISTS reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_sessions int DEFAULT 0,
  total_words_read int DEFAULT 0,
  average_accuracy decimal DEFAULT 0,
  current_streak_days int DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Create activity_completions table
CREATE TABLE IF NOT EXISTS activity_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  score int CHECK (score >= 0 AND score <= 100),
  completed_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for assessments
CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for activities (public read)
CREATE POLICY "Anyone can view activities"
  ON activities FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for reading_sessions
CREATE POLICY "Users can view own reading sessions"
  ON reading_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own reading sessions"
  ON reading_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for badges (public read)
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can earn badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for reading_progress
CREATE POLICY "Users can view own progress"
  ON reading_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own progress"
  ON reading_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON reading_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for activity_completions
CREATE POLICY "Users can view own activity completions"
  ON activity_completions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own activity completions"
  ON activity_completions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Insert sample badges
INSERT INTO badges (name, description, icon, criteria) VALUES
  ('İlk Adım', 'İlk değerlendirmeni tamamladın!', 'star', '{"type": "assessment_complete"}'),
  ('Dikkat Ustası', '10 dikkat aktivitesi tamamladın!', 'zap', '{"type": "activities", "count": 10}'),
  ('Okuma Kahramanı', '5 okuma oturumu tamamladın!', 'book-open', '{"type": "reading_sessions", "count": 5}'),
  ('Hatasız Okuyucu', '%90 doğrulukla bir metin okudun!', 'target', '{"type": "accuracy", "threshold": 90}'),
  ('Hızlı Okuyucu', 'Okuma hızın artıyor!', 'gauge', '{"type": "speed_improvement"}'),
  ('Azimli Öğrenci', '7 gün üst üste pratik yaptın!', 'flame', '{"type": "streak", "days": 7}')
ON CONFLICT (name) DO NOTHING;

-- Insert sample activities
INSERT INTO activities (title, type, difficulty, content, duration_minutes) VALUES
  ('Kelime Avı', 'word_search', 1, '{"words": ["kedi", "köpek", "kuş"], "grid_size": 8}', 3),
  ('Farkı Bul', 'spot_difference', 2, '{"differences": 5, "theme": "garden"}', 3),
  ('Harfleri Eşleştir', 'letter_match', 1, '{"pairs": ["b-d", "p-q", "m-n"]}', 2),
  ('Kelime Zincirleri', 'word_chain', 2, '{"start_word": "kale", "chain_length": 5}', 4)
ON CONFLICT DO NOTHING;