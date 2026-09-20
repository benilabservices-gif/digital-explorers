# Supabase SQL Schema — Digital Explorers

Copie-colle ce contenu dans **Supabase SQL Editor** pour créer toutes les tables.

```sql
-- ============================================================
-- DIGITAL EXPLORERS — Learning Experience Engine Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PARENTS
CREATE TABLE parents (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  plan TEXT DEFAULT 'starter',
  plan_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHILDREN
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '👦🏾',
  age INTEGER,
  grade_level TEXT,
  interests TEXT[],
  phase TEXT DEFAULT 'explorer',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  diagnosis JSONB DEFAULT '{}',
  skills JSONB DEFAULT '{"web":0,"ai":0,"coding":0,"creator":0,"cyber":0,"blockchain":0,"innovation":0}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ADVENTURE PROGRESS
CREATE TABLE child_adventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  adventure_slug TEXT NOT NULL,
  world_slug TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  quiz_score INTEGER,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, adventure_slug)
);

-- BADGES
CREATE TABLE child_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  badge_slug TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, badge_slug)
);

-- QUIZ ATTEMPTS
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  adventure_slug TEXT NOT NULL,
  score INTEGER,
  total INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS
CREATE TABLE child_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  world_slug TEXT,
  slug TEXT UNIQUE,
  thumbnail TEXT,
  skills TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SKILL PROGRESS
CREATE TABLE skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  level TEXT DEFAULT 'discover',
  xp INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, skill_name)
);

-- DAILY CHALLENGES
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  world_slug TEXT,
  xp_reward INTEGER DEFAULT 50,
  badge_slug TEXT,
  date DATE NOT NULL,
  active BOOLEAN DEFAULT true
);

-- XP EVENTS
CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source TEXT NOT NULL,
  source_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WORLDS
CREATE TABLE worlds (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  color TEXT,
  gradient TEXT,
  phase TEXT DEFAULT 'explorer'
);

-- ADVENTURES
CREATE TABLE adventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  world_id TEXT REFERENCES worlds(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  story TEXT,
  xp_reward INTEGER DEFAULT 100,
  level INTEGER DEFAULT 1,
  skills TEXT[],
  age_min INTEGER DEFAULT 11,
  age_max INTEGER DEFAULT 18,
  prerequisites TEXT[]
);

-- ADVENTURE SECTIONS
CREATE TABLE adventure_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  adventure_id UUID REFERENCES adventures(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  order_num INTEGER NOT NULL,
  title TEXT,
  content TEXT,
  quiz_questions JSONB
);

-- BADGES CONTENT
CREATE TABLE badges (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  rarity TEXT DEFAULT 'common',
  xp_required INTEGER DEFAULT 0,
  world_id TEXT REFERENCES worlds(id)
);

-- DIGITAL BRIDGES
CREATE TABLE digital_bridges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  target_url TEXT NOT NULL,
  icon TEXT,
  world_id TEXT REFERENCES worlds(id),
  order_num INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- ROW LEVEL SECURITY
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE adventure_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_bridges ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Parents read own" ON parents FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Parents insert own" ON parents FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Parents read children" ON children FOR SELECT USING (
  EXISTS (SELECT 1 FROM parents WHERE parents.id = children.parent_id AND parents.id = auth.uid())
);
CREATE POLICY "Parents insert children" ON children FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM parents WHERE parents.id = children.parent_id AND parents.id = auth.uid())
);
CREATE POLICY "Parents update children" ON children FOR UPDATE USING (
  EXISTS (SELECT 1 FROM parents WHERE parents.id = children.parent_id AND parents.id = auth.uid())
);

CREATE POLICY "Parents manage adventures" ON child_adventures FOR ALL USING (
  EXISTS (SELECT 1 FROM children WHERE children.id = child_adventures.child_id AND children.parent_id = auth.uid())
);
CREATE POLICY "Parents manage badges" ON child_badges FOR ALL USING (
  EXISTS (SELECT 1 FROM children WHERE children.id = child_badges.child_id AND children.parent_id = auth.uid())
);
CREATE POLICY "Parents manage projects" ON child_projects FOR ALL USING (
  EXISTS (SELECT 1 FROM children WHERE children.id = child_projects.child_id AND children.parent_id = auth.uid())
);
CREATE POLICY "Parents manage skills" ON skill_progress FOR ALL USING (
  EXISTS (SELECT 1 FROM children WHERE children.id = skill_progress.child_id AND children.parent_id = auth.uid())
);
CREATE POLICY "Parents manage xp" ON xp_events FOR ALL USING (
  EXISTS (SELECT 1 FROM children WHERE children.id = xp_events.child_id AND children.parent_id = auth.uid())
);
CREATE POLICY "Parents manage quizzes" ON quiz_attempts FOR ALL USING (
  EXISTS (SELECT 1 FROM children WHERE children.id = quiz_attempts.child_id AND children.parent_id = auth.uid())
);

CREATE POLICY "Public read content" ON worlds FOR SELECT USING (true);
CREATE POLICY "Public read adventures" ON adventures FOR SELECT USING (true);
CREATE POLICY "Public read sections" ON adventure_sections FOR SELECT USING (true);
CREATE POLICY "Public read bridges" ON digital_bridges FOR SELECT USING (true);
CREATE POLICY "Public read badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Public read challenges" ON daily_challenges FOR SELECT USING (active = true);

-- Functions
CREATE OR REPLACE FUNCTION award_xp(child_id UUID, amount INTEGER, source TEXT, source_id TEXT DEFAULT NULL)
RETURNS VOID AS $$
DECLARE new_xp INTEGER; new_level INTEGER;
BEGIN
  UPDATE children SET xp = xp + amount WHERE id = child_id RETURNING xp INTO new_xp;
  new_level := FLOOR(new_xp / 500) + 1;
  UPDATE children SET level = new_level WHERE id = child_id;
  INSERT INTO xp_events (child_id, amount, source, source_id) VALUES (child_id, amount, source, source_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION complete_adventure(p_child_id UUID, p_adventure_slug TEXT, p_world_slug TEXT, p_xp INTEGER, p_quiz_score INTEGER DEFAULT NULL)
RETURNS UUID AS $$
DECLARE v_id UUID; v_exists BOOLEAN;
BEGIN
  SELECT EXISTS(SELECT 1 FROM child_adventures WHERE child_id = p_child_id AND adventure_slug = p_adventure_slug) INTO v_exists;
  IF v_exists THEN
    UPDATE child_adventures SET status = 'completed', progress = 100, xp_earned = p_xp, quiz_score = p_quiz_score, completed_at = NOW() WHERE child_id = p_child_id AND adventure_slug = p_adventure_slug;
    SELECT id INTO v_id FROM child_adventures WHERE child_id = p_child_id AND adventure_slug = p_adventure_slug;
  ELSE
    INSERT INTO child_adventures (child_id, adventure_slug, world_slug, status, progress, xp_earned, quiz_score, completed_at) VALUES (p_child_id, p_adventure_slug, p_world_slug, 'completed', 100, p_xp, p_quiz_score, NOW()) RETURNING id INTO v_id;
  END IF;
  PERFORM award_xp(p_child_id, p_xp, 'adventure', p_adventure_slug);
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION earn_badge(p_child_id UUID, p_badge_slug TEXT) RETURNS VOID AS $$
BEGIN
  INSERT INTO child_badges (child_id, badge_slug) VALUES (p_child_id, p_badge_slug) ON CONFLICT (child_id, badge_slug) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_skill(p_child_id UUID, p_skill_name TEXT, p_xp_gain INTEGER) RETURNS VOID AS $$
DECLARE v_current_xp INTEGER; v_new_level TEXT;
BEGIN
  SELECT COALESCE(sxp.xp, 0) INTO v_current_xp FROM skill_progress sxp WHERE sxp.child_id = p_child_id AND sxp.skill_name = p_skill_name;
  v_current_xp := v_current_xp + p_xp_gain;
  IF v_current_xp >= 300 THEN v_new_level := 'master';
  ELSIF v_current_xp >= 150 THEN v_new_level := 'apply';
  ELSIF v_current_xp >= 50 THEN v_new_level := 'practice';
  ELSE v_new_level := 'discover';
  END IF;
  INSERT INTO skill_progress (child_id, skill_name, level, xp, updated_at) VALUES (p_child_id, p_skill_name, v_new_level, v_current_xp, NOW()) ON CONFLICT (child_id, skill_name) DO UPDATE SET xp = skill_progress.xp + p_xp_gain, level = CASE WHEN skill_progress.xp + p_xp_gain >= 300 THEN 'master' WHEN skill_progress.xp + p_xp_gain >= 150 THEN 'apply' WHEN skill_progress.xp + p_xp_gain >= 50 THEN 'practice' ELSE 'discover' END, updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_parent() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.parents (id, email, name) VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_parent();
```
