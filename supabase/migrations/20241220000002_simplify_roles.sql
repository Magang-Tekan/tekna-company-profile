-- Migration: Simplify Role System
-- Description: Simplify to only admin and editor roles
-- Created: 2024-12-20

-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Authenticated users can view user roles" ON user_roles;
DROP POLICY IF EXISTS "Super admins can manage all user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can view user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Super admins can manage all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage languages" ON languages;

-- Update user_roles table to only have admin and editor
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_role_check;
ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check CHECK (role IN ('admin', 'editor'));

-- Create simple policies for user_roles
CREATE POLICY "Users can view their own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user roles" ON user_roles
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role = 'admin' AND is_active = true
        )
    );

-- Create simple policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all user profiles" ON user_profiles
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role = 'admin' AND is_active = true
        )
    );

-- Update all other policies to use admin instead of super_admin
UPDATE user_roles SET role = 'admin' WHERE role = 'super_admin';

-- Update RLS policies for content management
DROP POLICY IF EXISTS "Admins can manage companies" ON companies;
DROP POLICY IF EXISTS "Admins can manage company translations" ON company_translations;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage tags" ON tags;
DROP POLICY IF EXISTS "Admins and editors can manage posts" ON posts;
DROP POLICY IF EXISTS "Admins and editors can manage post translations" ON post_translations;
DROP POLICY IF EXISTS "Admins and editors can manage post tags" ON post_tags;
DROP POLICY IF EXISTS "Admins and editors can manage projects" ON projects;
DROP POLICY IF EXISTS "Admins and editors can manage project translations" ON project_translations;
DROP POLICY IF EXISTS "Admins and editors can manage project images" ON project_images;
DROP POLICY IF EXISTS "Super admins can view newsletter subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Super admins can manage newsletter subscriptions" ON newsletter_subscriptions;

-- Create simplified policies
CREATE POLICY "Admins can manage languages" ON languages
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role = 'admin' AND is_active = true
        )
    );

CREATE POLICY "Admins can manage companies" ON companies
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role = 'admin' AND is_active = true
        )
    );

CREATE POLICY "Admins can manage company translations" ON company_translations
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role = 'admin' AND is_active = true
        )
    );

CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role IN ('admin', 'editor') AND is_active = true
        )
    );

CREATE POLICY "Admins can manage tags" ON tags
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role IN ('admin', 'editor') AND is_active = true
        )
    );

CREATE POLICY "Admins and editors can manage posts" ON posts
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role IN ('admin', 'editor') AND is_active = true
        )
    );

CREATE POLICY "Admins and editors can manage post translations" ON post_translations
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role IN ('admin', 'editor') AND is_active = true
        )
    );

CREATE POLICY "Admins and editors can manage post tags" ON post_tags
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role IN ('admin', 'editor') AND is_active = true
        )
    );

CREATE POLICY "Admins and editors can manage projects" ON projects
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role IN ('admin', 'editor') AND is_active = true
        )
    );

CREATE POLICY "Admins and editors can manage project translations" ON project_translations
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role IN ('admin', 'editor') AND is_active = true
        )
    );

CREATE POLICY "Admins and editors can manage project images" ON project_images
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role IN ('admin', 'editor') AND is_active = true
        )
    );

CREATE POLICY "Admins can view newsletter subscriptions" ON newsletter_subscriptions
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role = 'admin' AND is_active = true
        )
    );

CREATE POLICY "Admins can manage newsletter subscriptions" ON newsletter_subscriptions
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles 
            WHERE role = 'admin' AND is_active = true
        )
    );

