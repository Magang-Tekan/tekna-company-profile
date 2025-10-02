-- Fix career system RLS policies to allow public access without login
-- Created: 2025-01-30

-- Drop existing career policies that might be causing issues
DROP POLICY IF EXISTS "Career categories public read" ON career_categories;
DROP POLICY IF EXISTS "Career categories admin hr write" ON career_categories;
DROP POLICY IF EXISTS "Career locations public read" ON career_locations;
DROP POLICY IF EXISTS "Career locations admin hr write" ON career_locations;
DROP POLICY IF EXISTS "Career types public read" ON career_types;
DROP POLICY IF EXISTS "Career types admin hr write" ON career_types;
DROP POLICY IF EXISTS "Career levels public read" ON career_levels;
DROP POLICY IF EXISTS "Career levels admin hr write" ON career_levels;
DROP POLICY IF EXISTS "Career positions public read" ON career_positions;
DROP POLICY IF EXISTS "Career positions admin read all" ON career_positions;
DROP POLICY IF EXISTS "Career positions admin hr write" ON career_positions;
DROP POLICY IF EXISTS "Career skills public read" ON career_skills;
DROP POLICY IF EXISTS "Career skills admin hr write" ON career_skills;
DROP POLICY IF EXISTS "Career position skills public read" ON career_position_skills;
DROP POLICY IF EXISTS "Career position skills admin hr write" ON career_position_skills;
DROP POLICY IF EXISTS "Career applications public insert" ON career_applications;
DROP POLICY IF EXISTS "Career applications public read" ON career_applications;
DROP POLICY IF EXISTS "Career applications admin hr read all" ON career_applications;
DROP POLICY IF EXISTS "Career applications admin hr manage" ON career_applications;
DROP POLICY IF EXISTS "Career application activities admin hr read" ON career_application_activities;
DROP POLICY IF EXISTS "Career application activities admin hr manage" ON career_application_activities;

-- Create new simplified policies that allow public access

-- Career Categories - Allow public read access
CREATE POLICY "Enable read access for all users" ON career_categories
    FOR SELECT USING (true);

-- Career Locations - Allow public read access  
CREATE POLICY "Enable read access for all users" ON career_locations
    FOR SELECT USING (true);

-- Career Types - Allow public read access
CREATE POLICY "Enable read access for all users" ON career_types
    FOR SELECT USING (true);

-- Career Levels - Allow public read access
CREATE POLICY "Enable read access for all users" ON career_levels
    FOR SELECT USING (true);

-- Career Skills - Allow public read access
CREATE POLICY "Enable read access for all users" ON career_skills
    FOR SELECT USING (true);

-- Career Position Skills - Allow public read access
CREATE POLICY "Enable read access for all users" ON career_position_skills
    FOR SELECT USING (true);

-- Career Positions - Allow public read access to published positions
CREATE POLICY "Enable read access for all users" ON career_positions
    FOR SELECT USING (
        is_active = true AND 
        status = 'open' AND 
        published_at IS NOT NULL
    );

-- Career Applications - Allow public insert (for job applications)
CREATE POLICY "Enable insert for all users" ON career_applications
    FOR INSERT WITH CHECK (true);

-- Career Applications - Allow public read (for viewing applications)
CREATE POLICY "Enable read access for all users" ON career_applications
    FOR SELECT USING (true);

-- Career Application Activities - Allow public read
CREATE POLICY "Enable read access for all users" ON career_application_activities
    FOR SELECT USING (true);

-- Grant necessary permissions to anon and authenticated users
GRANT SELECT ON career_categories TO anon;
GRANT SELECT ON career_categories TO authenticated;
GRANT SELECT ON career_locations TO anon;
GRANT SELECT ON career_locations TO authenticated;
GRANT SELECT ON career_types TO anon;
GRANT SELECT ON career_types TO authenticated;
GRANT SELECT ON career_levels TO anon;
GRANT SELECT ON career_levels TO authenticated;
GRANT SELECT ON career_skills TO anon;
GRANT SELECT ON career_skills TO authenticated;
GRANT SELECT ON career_position_skills TO anon;
GRANT SELECT ON career_position_skills TO authenticated;
GRANT SELECT ON career_positions TO anon;
GRANT SELECT ON career_positions TO authenticated;
GRANT INSERT ON career_applications TO anon;
GRANT INSERT ON career_applications TO authenticated;
GRANT SELECT ON career_applications TO anon;
GRANT SELECT ON career_applications TO authenticated;
GRANT SELECT ON career_application_activities TO anon;
GRANT SELECT ON career_application_activities TO authenticated;

-- Ensure RLS is enabled on all career tables
ALTER TABLE career_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_position_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_application_activities ENABLE ROW LEVEL SECURITY;
