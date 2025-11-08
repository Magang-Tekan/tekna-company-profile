-- Migration: Performance Fixes and Supabase Advisor Issues
-- Description: Fix auth_rls_initplan, multiple_permissive_policies, and function search_path issues
-- Created: 2025-08-27 (consolidated from multiple migrations)

-- =====================================================
-- PART 1: FIX SECURITY DEFINER VIEW ISSUE
-- =====================================================

-- Drop the existing view that has SECURITY DEFINER issues
DROP VIEW IF EXISTS published_posts_with_categories;

-- Create a function instead of a view to avoid SECURITY DEFINER issues
CREATE OR REPLACE FUNCTION get_published_posts_with_categories()
RETURNS TABLE (
    id UUID,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    author_name TEXT,
    category_id UUID,
    status TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN,
    view_count INTEGER,
    is_active BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    categories JSONB
) 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.featured_image_url,
        p.author_name,
        p.category_id,
        p.status,
        p.published_at,
        p.is_featured,
        p.view_count,
        p.is_active,
        p.created_at,
        p.updated_at,
        jsonb_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug,
            'color', c.color,
            'description', c.description
        ) as categories
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published' AND p.is_active = true;
END;
$$;

-- =====================================================
-- PART 2: FIX FUNCTION SEARCH PATH MUTABLE ISSUES
-- =====================================================

-- Fix get_user_role function (ensure it has search_path)
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID)
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM user_roles
    WHERE user_id = p_user_id AND is_active = true;
    
    RETURN user_role;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Fix increment_post_views function
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE posts 
    SET view_count = COALESCE(view_count, 0) + 1,
        updated_at = NOW()
    WHERE id = post_id;
END;
$$;

-- Fix increment_position_views function
CREATE OR REPLACE FUNCTION increment_position_views(position_id UUID)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE career_positions 
    SET view_count = view_count + 1 
    WHERE id = position_id;
END;
$$;

-- Fix increment_applications_count function (standalone version for backward compatibility)
CREATE OR REPLACE FUNCTION increment_applications_count(position_id UUID)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE career_positions 
    SET applications_count = applications_count + 1
    WHERE id = position_id;
END;
$$;

-- Fix update_partners_updated_at function
CREATE OR REPLACE FUNCTION update_partners_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- =====================================================
-- PART 3: FIX AUTH_RLS_INITPLAN ISSUES
-- Replace auth.<function>() with (select auth.<function>())
-- =====================================================

-- Fix for public.languages table
DROP POLICY IF EXISTS "Admins can manage languages" ON public.languages;
CREATE POLICY "Admins can manage languages" ON public.languages
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.companies table
DROP POLICY IF EXISTS "Admins can manage companies" ON public.companies;
CREATE POLICY "Admins can manage companies" ON public.companies
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.company_translations table
DROP POLICY IF EXISTS "Admins can manage company translations" ON public.company_translations;
CREATE POLICY "Admins can manage company translations" ON public.company_translations
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.categories table
DROP POLICY IF EXISTS "Admins and editors can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Categories admin editor manage" ON public.categories;
CREATE POLICY "Categories admin editor manage" ON public.categories
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.tags table
DROP POLICY IF EXISTS "Admins and editors can manage tags" ON public.tags;
DROP POLICY IF EXISTS "Tags admin editor manage" ON public.tags;
CREATE POLICY "Tags admin editor manage" ON public.tags
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.posts table
DROP POLICY IF EXISTS "Admins and editors can manage posts" ON public.posts;
DROP POLICY IF EXISTS "Posts admin editor manage" ON public.posts;
CREATE POLICY "Posts admin editor manage" ON public.posts
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.post_translations table
DROP POLICY IF EXISTS "Admins and editors can manage post translations" ON public.post_translations;
DROP POLICY IF EXISTS "Post translations admin editor manage" ON public.post_translations;
CREATE POLICY "Post translations admin editor manage" ON public.post_translations
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.post_tags table
DROP POLICY IF EXISTS "Admins and editors can manage post tags" ON public.post_tags;
DROP POLICY IF EXISTS "Post tags admin editor manage" ON public.post_tags;
CREATE POLICY "Post tags admin editor manage" ON public.post_tags
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.projects table
DROP POLICY IF EXISTS "Admins and editors can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Projects admin editor manage" ON public.projects;
CREATE POLICY "Projects admin editor manage" ON public.projects
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.project_translations table
DROP POLICY IF EXISTS "Admins and editors can manage project translations" ON public.project_translations;
DROP POLICY IF EXISTS "Project translations admin editor manage" ON public.project_translations;
CREATE POLICY "Project translations admin editor manage" ON public.project_translations
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.project_images table
DROP POLICY IF EXISTS "Admins and editors can manage project images" ON public.project_images;
DROP POLICY IF EXISTS "Project images admin editor manage" ON public.project_images;
CREATE POLICY "Project images admin editor manage" ON public.project_images
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- Fix for public.newsletter_subscriptions table
DROP POLICY IF EXISTS "Admins can manage newsletter subscriptions" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Admins can view newsletter subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Admins can view newsletter subscriptions" ON public.newsletter_subscriptions
    FOR SELECT USING ((select auth.role()) = 'service_role');
CREATE POLICY "Admins can manage newsletter subscriptions" ON public.newsletter_subscriptions
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.user_roles table
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" ON public.user_roles
    FOR ALL USING ((select auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Authenticated users can see all roles" ON public.user_roles;
CREATE POLICY "Authenticated users can see all roles" ON public.user_roles
    FOR SELECT USING ((select auth.role()) = 'authenticated');

-- Fix for public.user_profiles table
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON public.user_profiles;
CREATE POLICY "Admins can manage all user profiles" ON public.user_profiles
    FOR ALL USING ((select auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Users can view and update their own profile" ON public.user_profiles;
CREATE POLICY "Users can view and update their own profile" ON public.user_profiles
    FOR ALL USING ((select auth.uid()) = user_id);

-- Fix for public.media_files table
DROP POLICY IF EXISTS "Authenticated users can upload media files" ON public.media_files;
CREATE POLICY "Authenticated users can upload media files" ON public.media_files
    FOR INSERT WITH CHECK ((select auth.role()) = 'authenticated');

DROP POLICY IF EXISTS "Users can delete their uploaded files" ON public.media_files;
CREATE POLICY "Users can delete their uploaded files" ON public.media_files
    FOR DELETE USING ((select auth.uid()) = uploaded_by);

DROP POLICY IF EXISTS "Users can update their uploaded files" ON public.media_files;
CREATE POLICY "Users can update their uploaded files" ON public.media_files
    FOR UPDATE USING ((select auth.uid()) = uploaded_by);

-- Fix for public.footer_sections table
DROP POLICY IF EXISTS "Admins can manage footer sections" ON public.footer_sections;
CREATE POLICY "Admins can manage footer sections" ON public.footer_sections
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.footer_links table
DROP POLICY IF EXISTS "Admins can manage footer links" ON public.footer_links;
CREATE POLICY "Admins can manage footer links" ON public.footer_links
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.social_media table
DROP POLICY IF EXISTS "Admins can manage social media" ON public.social_media;
CREATE POLICY "Admins can manage social media" ON public.social_media
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.contact_info table
DROP POLICY IF EXISTS "Admins can manage contact info" ON public.contact_info;
CREATE POLICY "Admins can manage contact info" ON public.contact_info
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.newsletter_settings table
DROP POLICY IF EXISTS "Admins can manage newsletter settings" ON public.newsletter_settings;
CREATE POLICY "Admins can manage newsletter settings" ON public.newsletter_settings
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for translation tables
DROP POLICY IF EXISTS "Admins can manage footer section translations" ON public.footer_section_translations;
CREATE POLICY "Admins can manage footer section translations" ON public.footer_section_translations
    FOR ALL USING ((select auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Admins can manage footer link translations" ON public.footer_link_translations;
CREATE POLICY "Admins can manage footer link translations" ON public.footer_link_translations
    FOR ALL USING ((select auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Admins can manage contact info translations" ON public.contact_info_translations;
CREATE POLICY "Admins can manage contact info translations" ON public.contact_info_translations
    FOR ALL USING ((select auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Admins can manage newsletter settings translations" ON public.newsletter_settings_translations;
CREATE POLICY "Admins can manage newsletter settings translations" ON public.newsletter_settings_translations
    FOR ALL USING ((select auth.role()) = 'service_role');

-- Fix for public.partners table
DROP POLICY IF EXISTS "Admins and editors can manage partners" ON public.partners;
DROP POLICY IF EXISTS "Partners admin editor manage" ON public.partners;
CREATE POLICY "Partners admin editor manage" ON public.partners
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- =====================================================
-- PART 4: FIX MULTIPLE_PERMISSIVE_POLICIES ISSUES
-- Consolidate overlapping policies for better performance
-- =====================================================

-- Note: Career policies are already consolidated in career_system.sql
-- These fixes are for any remaining duplicate policies

-- Fix for public read policies (consolidate where possible)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.languages;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.companies;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.tags;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.post_tags;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.media_files;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.company_translations;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.post_translations;

-- These are already handled by the policies in security_and_roles.sql
-- No need to recreate them here

-- =====================================================
-- PART 5: PERFORMANCE INDEXES
-- =====================================================

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_career_positions_status_active ON career_positions(status, is_active);
CREATE INDEX IF NOT EXISTS idx_career_applications_email ON career_applications(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_active ON user_roles(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);

-- =====================================================
-- PART 6: GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions on all fixed functions
GRANT EXECUTE ON FUNCTION get_published_posts_with_categories() TO anon;
GRANT EXECUTE ON FUNCTION get_published_posts_with_categories() TO authenticated;

GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION increment_post_views(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_post_views(UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION increment_position_views(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_position_views(UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION increment_applications_count(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_applications_count(UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION update_partners_updated_at() TO anon;
GRANT EXECUTE ON FUNCTION update_partners_updated_at() TO authenticated;

GRANT EXECUTE ON FUNCTION update_updated_at_column() TO anon;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated;

-- Grant permissions for public read access
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant permissions for service role (admin operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- =====================================================
-- PART 7: COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON FUNCTION get_published_posts_with_categories() IS 'Replaces the SECURITY DEFINER view with a SECURITY INVOKER function for better security';
COMMENT ON FUNCTION get_user_role(UUID) IS 'Get user role for RLS policies with proper performance optimization and search_path';
COMMENT ON FUNCTION update_updated_at_column() IS 'Update updated_at timestamp with proper search_path setting';
COMMENT ON FUNCTION increment_post_views(UUID) IS 'Increment post view count with proper search_path setting';
COMMENT ON FUNCTION increment_position_views(UUID) IS 'Increment position view count with proper search_path setting';
COMMENT ON FUNCTION increment_applications_count(UUID) IS 'Increment applications count with proper search_path setting';
COMMENT ON FUNCTION update_partners_updated_at() IS 'Update partners updated_at with proper search_path setting';

