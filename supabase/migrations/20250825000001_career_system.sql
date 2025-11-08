-- Migration: Career System
-- Description: Complete career/job posting system with applications, skills, and notifications
-- Created: 2025-08-25 (consolidated from multiple migrations)

-- =====================================================
-- CAREER TABLES
-- =====================================================

-- Career categories table
CREATE TABLE career_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text, -- lucide-react icon name
  color text, -- hex color or tailwind class
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Career locations table
CREATE TABLE career_locations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  address text,
  city text NOT NULL,
  state text,
  country text NOT NULL DEFAULT 'Indonesia',
  timezone text DEFAULT 'Asia/Jakarta',
  is_remote boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Career types table
CREATE TABLE career_types (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL, -- Full-time, Part-time, Contract, Internship
  slug text NOT NULL UNIQUE,
  description text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Career levels table
CREATE TABLE career_levels (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL, -- Entry Level, Mid Level, Senior Level, Executive
  slug text NOT NULL UNIQUE,
  description text,
  years_min integer DEFAULT 0,
  years_max integer,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Career positions table (main job postings)
CREATE TABLE career_positions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  category_id uuid REFERENCES career_categories(id) ON DELETE SET NULL,
  location_id uuid REFERENCES career_locations(id) ON DELETE SET NULL,
  type_id uuid REFERENCES career_types(id) ON DELETE SET NULL,
  level_id uuid REFERENCES career_levels(id) ON DELETE SET NULL,
  
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text, -- Brief job summary
  description text NOT NULL, -- Full job description (markdown)
  requirements text, -- Job requirements (markdown)
  benefits text, -- Benefits and perks (markdown)
  
  salary_min bigint, -- Salary range minimum
  salary_max bigint, -- Salary range maximum
  salary_currency text DEFAULT 'IDR',
  salary_type text DEFAULT 'monthly', -- monthly, yearly, hourly
  
  application_deadline timestamptz,
  start_date timestamptz,
  
  remote_allowed boolean DEFAULT false,
  travel_required boolean DEFAULT false,
  travel_percentage integer DEFAULT 0,
  
  featured boolean DEFAULT false,
  urgent boolean DEFAULT false,
  status text DEFAULT 'open' CHECK (status IN ('draft', 'open', 'closed', 'filled')),
  
  views_count integer DEFAULT 0,
  applications_count integer DEFAULT 0,
  
  seo_title text,
  seo_description text,
  seo_keywords text,
  
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  is_active boolean DEFAULT true,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Career skills table (for skill requirements)
CREATE TABLE career_skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  category text, -- technical, soft, language, certification
  description text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Junction table for position skills
CREATE TABLE career_position_skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  position_id uuid REFERENCES career_positions(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES career_skills(id) ON DELETE CASCADE,
  level text DEFAULT 'required' CHECK (level IN ('required', 'preferred', 'nice-to-have')),
  proficiency text CHECK (proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(position_id, skill_id)
);

-- Career applications table
CREATE TABLE career_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  position_id uuid REFERENCES career_positions(id) ON DELETE CASCADE,
  
  -- Applicant information
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  linkedin_url text,
  portfolio_url text,
  github_url text,
  
  -- Application details
  cover_letter text,
  resume_url text, -- URL to stored resume file
  additional_documents jsonb, -- array of document URLs
  
  -- Application status
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'interview_scheduled', 'interview_completed', 'offered', 'accepted', 'rejected', 'withdrawn')),
  notes text, -- Internal notes
  
  -- Metadata
  source text, -- where the application came from
  applied_at timestamptz DEFAULT now(),
  last_activity_at timestamptz DEFAULT now(),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Career application activities table (for tracking application progress)
CREATE TABLE career_application_activities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id uuid REFERENCES career_applications(id) ON DELETE CASCADE,
  
  activity_type text NOT NULL, -- status_change, note_added, interview_scheduled, etc.
  old_status text,
  new_status text,
  description text,
  notes text,
  
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_career_positions_company_id ON career_positions(company_id);
CREATE INDEX idx_career_positions_category_id ON career_positions(category_id);
CREATE INDEX idx_career_positions_location_id ON career_positions(location_id);
CREATE INDEX idx_career_positions_type_id ON career_positions(type_id);
CREATE INDEX idx_career_positions_level_id ON career_positions(level_id);
CREATE INDEX idx_career_positions_status ON career_positions(status);
CREATE INDEX idx_career_positions_featured ON career_positions(featured);
CREATE INDEX idx_career_positions_published_at ON career_positions(published_at);
CREATE INDEX idx_career_positions_slug ON career_positions(slug);
CREATE INDEX idx_career_positions_status_active ON career_positions(status, is_active);

CREATE INDEX idx_career_applications_position_id ON career_applications(position_id);
CREATE INDEX idx_career_applications_status ON career_applications(status);
CREATE INDEX idx_career_applications_email ON career_applications(email);
CREATE INDEX idx_career_applications_applied_at ON career_applications(applied_at);

CREATE INDEX idx_career_position_skills_position_id ON career_position_skills(position_id);
CREATE INDEX idx_career_position_skills_skill_id ON career_position_skills(skill_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE TRIGGER update_career_categories_updated_at
  BEFORE UPDATE ON career_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_locations_updated_at
  BEFORE UPDATE ON career_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_types_updated_at
  BEFORE UPDATE ON career_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_levels_updated_at
  BEFORE UPDATE ON career_levels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_positions_updated_at
  BEFORE UPDATE ON career_positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_skills_updated_at
  BEFORE UPDATE ON career_skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_applications_updated_at
  BEFORE UPDATE ON career_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CAREER FUNCTIONS
-- =====================================================

-- Function to increment position views
CREATE OR REPLACE FUNCTION increment_position_views(position_id uuid)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE career_positions 
  SET views_count = views_count + 1 
  WHERE id = position_id;
END;
$$;

-- Function to update application count
CREATE OR REPLACE FUNCTION increment_applications_count()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE career_positions
  SET applications_count = applications_count + 1
  WHERE id = NEW.position_id;
  RETURN NEW;
END;
$$;

-- Trigger to update applications count when new application is created
CREATE TRIGGER on_application_created_increment_count
  AFTER INSERT ON career_applications
  FOR EACH ROW EXECUTE FUNCTION increment_applications_count();

-- =====================================================
-- EMAIL NOTIFICATION FUNCTIONS
-- =====================================================

-- Email notification function with error handling
CREATE OR REPLACE FUNCTION send_application_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to send email notification, fallback to logging if it fails
  BEGIN
    PERFORM net.http_post(
      url := 'https://rarxrbqpndlfxchdxnat.supabase.co/functions/v1/send-application-email'::text,
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.supabase_service_role_key', true) || '"}'::text,
      body := json_build_object(
        'application_id', NEW.id,
        'applicant_email', NEW.email,
        'applicant_name', NEW.first_name || ' ' || NEW.last_name,
        'position_id', NEW.position_id,
        'type', 'confirmation'
      )::jsonb
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log the notification attempt instead of sending HTTP request
    RAISE LOG 'Application notification would be sent for application % (email: %, position: %) - Error: %', 
      NEW.id, NEW.email, NEW.position_id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new applications
CREATE TRIGGER on_application_submitted
  AFTER INSERT ON career_applications
  FOR EACH ROW
  EXECUTE FUNCTION send_application_notification();

-- Status notification function with error handling
CREATE OR REPLACE FUNCTION send_application_status_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send email if status actually changed
  IF OLD.status != NEW.status THEN
    BEGIN
      PERFORM net.http_post(
        url := 'https://rarxrbqpndlfxchdxnat.supabase.co/functions/v1/send-application-email'::text,
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.supabase_service_role_key', true) || '"}'::text,
        body := json_build_object(
          'application_id', NEW.id,
          'applicant_email', NEW.email,
          'applicant_name', NEW.first_name || ' ' || NEW.last_name,
          'position_id', NEW.position_id,
          'old_status', OLD.status,
          'new_status', NEW.status,
          'type', 'status_update'
        )::jsonb
      );
    EXCEPTION WHEN OTHERS THEN
      -- Log the notification attempt instead of sending HTTP request
      RAISE LOG 'Application status notification would be sent for application %: % -> % - Error: %', 
        NEW.id, OLD.status, NEW.status, SQLERRM;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for application status updates
CREATE TRIGGER on_application_status_change
  AFTER UPDATE ON career_applications
  FOR EACH ROW
  EXECUTE FUNCTION send_application_status_notification();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all career tables
ALTER TABLE career_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_position_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_application_activities ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC READ POLICIES
-- =====================================================

-- Career Categories - Public read access
CREATE POLICY "Career categories consolidated" ON career_categories
    FOR SELECT USING (true);

-- Career Locations - Public read access
CREATE POLICY "Career locations consolidated" ON career_locations
    FOR SELECT USING (true);

-- Career Types - Public read access
CREATE POLICY "Career types consolidated" ON career_types
    FOR SELECT USING (true);

-- Career Levels - Public read access
CREATE POLICY "Career levels consolidated" ON career_levels
    FOR SELECT USING (true);

-- Career Skills - Public read access
CREATE POLICY "Career skills consolidated" ON career_skills
    FOR SELECT USING (true);

-- Career Position Skills - Public read access
CREATE POLICY "Career position skills consolidated" ON career_position_skills
    FOR SELECT USING (true);

-- Career Positions - Public read access to published positions
CREATE POLICY "Career positions public read" ON career_positions
    FOR SELECT USING (is_active = true AND status = 'open');

-- Career Applications - Public insert and read own
CREATE POLICY "Career applications public insert" ON career_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Career applications public read own" ON career_applications
    FOR SELECT USING ((select auth.jwt() ->> 'email') = email);

-- Career Application Activities - Public read
CREATE POLICY "Career application activities public read" ON career_application_activities
    FOR SELECT USING (true);

-- =====================================================
-- ADMIN/HR MANAGEMENT POLICIES
-- =====================================================

-- Career Categories - Admin/HR can manage
CREATE POLICY "Career categories admin hr manage" ON career_categories
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Career Locations - Admin/HR can manage
CREATE POLICY "Career locations admin hr manage" ON career_locations
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Career Types - Admin/HR can manage
CREATE POLICY "Career types admin hr manage" ON career_types
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Career Levels - Admin/HR can manage
CREATE POLICY "Career levels admin hr manage" ON career_levels
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Career Positions - Admin/HR can manage
CREATE POLICY "Career positions admin hr manage" ON career_positions
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Career Skills - Admin/HR can manage
CREATE POLICY "Career skills admin hr manage" ON career_skills
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Career Position Skills - Admin/HR can manage
CREATE POLICY "Career position skills admin hr manage" ON career_position_skills
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Career Applications - Admin/HR can manage
CREATE POLICY "Career applications admin hr manage" ON career_applications
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- Career Application Activities - Admin/HR can manage
CREATE POLICY "Career application activities admin hr consolidated" ON career_application_activities
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'hr'));

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

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

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION increment_position_views(uuid) TO anon;
GRANT EXECUTE ON FUNCTION increment_position_views(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_applications_count() TO anon;
GRANT EXECUTE ON FUNCTION increment_applications_count() TO authenticated;

