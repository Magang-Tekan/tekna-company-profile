-- Migration: Security and Roles System
-- Description: User roles, profiles, RLS policies, and role-based access control
-- Created: 2024-12-20 (consolidated from multiple migrations)

-- =====================================================
-- USER ROLES & PROFILES
-- =====================================================

-- Create user roles table (maps Supabase Auth users to roles)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References Supabase Auth users.id
    role VARCHAR(50) DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'hr')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create user profiles table (extended info for Supabase Auth users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References Supabase Auth users.id
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add foreign keys to auth.users
ALTER TABLE user_roles 
ADD CONSTRAINT fk_user_roles_user_id 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

ALTER TABLE user_profiles 
ADD CONSTRAINT fk_user_profiles_user_id 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- =====================================================
-- HELPER FUNCTION FOR ROLES
-- =====================================================

-- Security-definer function to get user role (avoids recursion in RLS policies)
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = p_user_id AND is_active = true;
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- =====================================================
-- ROW LEVEL SECURITY - ENABLE RLS
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC READ ACCESS POLICIES
-- =====================================================

-- Languages: Public read access
CREATE POLICY "Languages are viewable by everyone" ON languages
    FOR SELECT USING (is_active = true);

-- Companies: Public read access
CREATE POLICY "Companies are viewable by everyone" ON companies
    FOR SELECT USING (is_active = true);

-- Company translations: Public read access
CREATE POLICY "Company translations are viewable by everyone" ON company_translations
    FOR SELECT USING (true);

-- Categories: Public read access
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (is_active = true);

-- Tags: Public read access
CREATE POLICY "Tags are viewable by everyone" ON tags
    FOR SELECT USING (true);

-- Posts: Public read access for published posts only
CREATE POLICY "Published posts are viewable by everyone" ON posts
    FOR SELECT USING (status = 'published' AND is_active = true);

-- Post translations: Public read access for published posts
CREATE POLICY "Post translations are viewable for published posts" ON post_translations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = post_translations.post_id 
            AND posts.status = 'published' 
            AND posts.is_active = true
        )
    );

-- Post tags: Public read access for published posts
CREATE POLICY "Post tags are viewable for published posts" ON post_tags
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.id = post_tags.post_id 
            AND posts.status = 'published' 
            AND posts.is_active = true
        )
    );

-- Projects: Public read access for active projects
CREATE POLICY "Active projects are viewable by everyone" ON projects
    FOR SELECT USING (is_active = true);

-- Project translations: Public read access for active projects
CREATE POLICY "Project translations are viewable for active projects" ON project_translations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_translations.project_id 
            AND projects.is_active = true
        )
    );

-- Project images: Public read access for active projects
CREATE POLICY "Project images are viewable for active projects" ON project_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_images.project_id 
            AND projects.is_active = true
        )
    );

-- Newsletter subscriptions: Public insert only (for signup)
CREATE POLICY "Newsletter subscriptions can be created by anyone" ON newsletter_subscriptions
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- USER ROLES & PROFILES POLICIES
-- =====================================================

-- User roles: Users can view their own role, authenticated users can see all
CREATE POLICY "Users can view their own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can see all roles" ON user_roles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage user roles" ON user_roles
    FOR ALL USING (get_user_role(auth.uid()) = 'admin')
    WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- User profiles: Users can view/edit their own profile, admins can manage all
CREATE POLICY "Users can view and update their own profile" ON user_profiles
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user profiles" ON user_profiles
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- =====================================================
-- ADMIN/EDITOR MANAGEMENT POLICIES
-- =====================================================

-- Companies: Only admins can manage
CREATE POLICY "Admins can manage companies" ON companies
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Languages: Only admins can manage
CREATE POLICY "Admins can manage languages" ON languages
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Company translations: Only admins can manage
CREATE POLICY "Admins can manage company translations" ON company_translations
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- Categories: Admins and editors can manage
CREATE POLICY "Admins and editors can manage categories" ON categories
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Tags: Admins and editors can manage
CREATE POLICY "Admins and editors can manage tags" ON tags
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Posts: Admins and editors can manage
CREATE POLICY "Admins and editors can manage posts" ON posts
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Post translations: Admins and editors can manage
CREATE POLICY "Admins and editors can manage post translations" ON post_translations
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Post tags: Admins and editors can manage
CREATE POLICY "Admins and editors can manage post tags" ON post_tags
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Projects: Admins and editors can manage
CREATE POLICY "Admins and editors can manage projects" ON projects
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Project translations: Admins and editors can manage
CREATE POLICY "Admins and editors can manage project translations" ON project_translations
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Project images: Admins and editors can manage
CREATE POLICY "Admins and editors can manage project images" ON project_images
    FOR ALL USING (get_user_role(auth.uid()) IN ('admin', 'editor'));

-- Newsletter subscriptions: Only admins can view/manage
CREATE POLICY "Admins can view newsletter subscriptions" ON newsletter_subscriptions
    FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can manage newsletter subscriptions" ON newsletter_subscriptions
    FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User roles indexes
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_user_roles_is_active ON user_roles(is_active);

-- User profiles indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Newsletter subscriptions indexes
CREATE INDEX idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX idx_newsletter_subscriptions_is_active ON newsletter_subscriptions(is_active);
CREATE INDEX idx_newsletter_subscriptions_subscribed_at ON newsletter_subscriptions(subscribed_at);

-- Performance indexes for search
CREATE INDEX idx_posts_status_published_at ON posts(status, published_at) WHERE status = 'published';
CREATE INDEX idx_post_translations_language_id ON post_translations(language_id);
CREATE INDEX idx_project_translations_language_id ON project_translations(language_id);

-- Full-text search indexes
CREATE INDEX idx_posts_search ON posts USING GIN (
    to_tsvector('english', title || ' ' || COALESCE(excerpt, ''))
);

CREATE INDEX idx_projects_search ON projects USING GIN (
    to_tsvector('english', name)
);

CREATE INDEX idx_post_translations_search ON post_translations USING GIN (
    to_tsvector('english', title || ' ' || COALESCE(content, '') || ' ' || COALESCE(excerpt, ''))
);

CREATE INDEX idx_project_translations_search ON project_translations USING GIN (
    to_tsvector('english', description || ' ' || COALESCE(short_description, ''))
);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Create triggers for new tables
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PAGINATION FUNCTIONS
-- =====================================================

-- Function to get paginated posts with search
CREATE OR REPLACE FUNCTION get_paginated_posts(
    search_query TEXT DEFAULT '',
    category_id UUID DEFAULT NULL,
    status_filter TEXT DEFAULT 'published',
    page_number INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 10,
    language_code TEXT DEFAULT 'en'
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    author_name TEXT,
    status TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN,
    total_count BIGINT
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH filtered_posts AS (
        SELECT 
            p.id,
            p.title,
            p.excerpt,
            p.featured_image_url,
            p.author_name,
            p.status,
            p.published_at,
            p.is_featured,
            COUNT(*) OVER() as total_count
        FROM posts p
        LEFT JOIN post_translations pt ON p.id = pt.post_id
        LEFT JOIN languages l ON pt.language_id = l.id
        WHERE p.is_active = true
        AND (search_query = '' OR 
             to_tsvector('english', p.title || ' ' || COALESCE(p.excerpt, '')) @@ plainto_tsquery('english', search_query) OR
             to_tsvector('english', pt.title || ' ' || COALESCE(pt.content, '') || ' ' || COALESCE(pt.excerpt, '')) @@ plainto_tsquery('english', search_query))
        AND (category_id IS NULL OR p.category_id = category_id)
        AND (status_filter = 'all' OR p.status = status_filter)
        AND (language_code = 'all' OR l.code = language_code)
    )
    SELECT 
        fp.id,
        fp.title,
        fp.excerpt,
        fp.featured_image_url,
        fp.author_name,
        fp.status,
        fp.published_at,
        fp.is_featured,
        fp.total_count
    FROM filtered_posts fp
    ORDER BY fp.published_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size;
END;
$$;

-- Function to get paginated projects with search
CREATE OR REPLACE FUNCTION get_paginated_projects(
    search_query TEXT DEFAULT '',
    page_number INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 10,
    language_code TEXT DEFAULT 'en'
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    project_url TEXT,
    featured_image_url TEXT,
    description TEXT,
    short_description TEXT,
    total_count BIGINT
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH filtered_projects AS (
        SELECT 
            p.id,
            p.name,
            p.slug,
            p.project_url,
            p.featured_image_url,
            pt.description,
            pt.short_description,
            COUNT(*) OVER() as total_count
        FROM projects p
        LEFT JOIN project_translations pt ON p.id = pt.project_id
        LEFT JOIN languages l ON pt.language_id = l.id
        WHERE p.is_active = true
        AND (search_query = '' OR 
             to_tsvector('english', p.name) @@ plainto_tsquery('english', search_query) OR
             to_tsvector('english', pt.description || ' ' || COALESCE(pt.short_description, '')) @@ plainto_tsquery('english', search_query))
        AND (language_code = 'all' OR l.code = language_code)
    )
    SELECT 
        fp.id,
        fp.name,
        fp.slug,
        fp.project_url,
        fp.featured_image_url,
        fp.description,
        fp.short_description,
        fp.total_count
    FROM filtered_projects fp
    ORDER BY fp.created_at DESC
    LIMIT page_size
    OFFSET (page_number - 1) * page_size;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_paginated_posts(TEXT, UUID, TEXT, INTEGER, INTEGER, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_paginated_posts(TEXT, UUID, TEXT, INTEGER, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_paginated_projects(TEXT, INTEGER, INTEGER, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION get_paginated_projects(TEXT, INTEGER, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO authenticated;

