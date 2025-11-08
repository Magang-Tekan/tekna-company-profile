-- Migration: Media Files and Storage System
-- Description: Media files table, storage buckets, and storage policies
-- Created: 2024-12-25 (consolidated from multiple migrations)

-- =====================================================
-- MEDIA FILES TABLE
-- =====================================================

-- Media files table for managing uploaded files
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER,
    height INTEGER,
    alt_text TEXT DEFAULT '',
    caption TEXT DEFAULT '',
    uploaded_by UUID, -- References auth.users.id
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(file_path)
);

-- =====================================================
-- STORAGE BUCKETS SETUP
-- =====================================================

-- Create media bucket for images, logos, etc.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Create documents bucket for PDFs, docs, etc.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  104857600, -- 100MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ]
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Storage Policies for Media Bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Media bucket public access" ON storage.objects;
DROP POLICY IF EXISTS "Media bucket authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Media bucket authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Media bucket authenticated deletes" ON storage.objects;

-- Public read access for media
CREATE POLICY "Media bucket public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Authenticated users can upload, update, delete
CREATE POLICY "Media bucket authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Media bucket authenticated updates" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'media' 
    AND auth.uid() IS NOT NULL
  )
  WITH CHECK (
    bucket_id = 'media' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Media bucket authenticated deletes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media' 
    AND auth.uid() IS NOT NULL
  );

-- Storage Policies for Documents Bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Documents bucket public access" ON storage.objects;
DROP POLICY IF EXISTS "Documents bucket authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Documents bucket authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Documents bucket authenticated deletes" ON storage.objects;

-- Public read access for documents
CREATE POLICY "Documents bucket public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

-- Authenticated users can upload, update, delete
CREATE POLICY "Documents bucket authenticated uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Documents bucket authenticated updates" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' 
    AND auth.uid() IS NOT NULL
  )
  WITH CHECK (
    bucket_id = 'documents' 
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Documents bucket authenticated deletes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' 
    AND auth.uid() IS NOT NULL
  );

-- =====================================================
-- INDEXES FOR MEDIA FILES
-- =====================================================

-- Performance indexes for media files
CREATE INDEX idx_media_files_filename ON media_files(filename);
CREATE INDEX idx_media_files_mime_type ON media_files(mime_type);
CREATE INDEX idx_media_files_uploaded_by ON media_files(uploaded_by);
CREATE INDEX idx_media_files_is_active ON media_files(is_active);
CREATE INDEX idx_media_files_created_at ON media_files(created_at);

-- Search index for text fields
CREATE INDEX idx_media_files_search ON media_files USING gin(
    to_tsvector('english', 
        COALESCE(original_filename, '') || ' ' || 
        COALESCE(alt_text, '') || ' ' || 
        COALESCE(caption, '')
    )
);

-- =====================================================
-- TRIGGERS FOR MEDIA FILES
-- =====================================================

-- Update trigger for updated_at
CREATE TRIGGER update_media_files_updated_at 
    BEFORE UPDATE ON media_files 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Public read access for active media files
CREATE POLICY "Active media files are viewable by everyone" ON media_files
    FOR SELECT USING (is_active = true);

-- Authenticated users can upload files
CREATE POLICY "Authenticated users can upload media files" ON media_files
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update files they uploaded
CREATE POLICY "Users can update their uploaded files" ON media_files
    FOR UPDATE USING (
        auth.uid() = uploaded_by 
        OR auth.uid() IS NOT NULL
    );

-- Users can delete files they uploaded
CREATE POLICY "Users can delete their uploaded files" ON media_files
    FOR DELETE USING (
        auth.uid() = uploaded_by 
        OR auth.uid() IS NOT NULL
    );

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get media file info by ID
CREATE OR REPLACE FUNCTION get_media_file_info(file_id UUID)
RETURNS TABLE (
    id UUID,
    filename VARCHAR(255),
    original_filename VARCHAR(255),
    file_url TEXT,
    file_size BIGINT,
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mf.id,
        mf.filename,
        mf.original_filename,
        mf.file_url,
        mf.file_size,
        mf.mime_type,
        mf.width,
        mf.height,
        mf.alt_text,
        mf.caption,
        mf.created_at
    FROM media_files mf
    WHERE mf.id = file_id 
    AND mf.is_active = true;
END;
$$;

-- Function to get media files by folder
CREATE OR REPLACE FUNCTION get_media_files_by_folder(folder_path TEXT, limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
    id UUID,
    filename VARCHAR(255),
    original_filename VARCHAR(255),
    file_url TEXT,
    file_size BIGINT,
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mf.id,
        mf.filename,
        mf.original_filename,
        mf.file_url,
        mf.file_size,
        mf.mime_type,
        mf.width,
        mf.height,
        mf.alt_text,
        mf.caption,
        mf.created_at
    FROM media_files mf
    WHERE mf.file_path LIKE folder_path || '%'
    AND mf.is_active = true
    ORDER BY mf.created_at DESC
    LIMIT limit_count;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_media_file_info(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_media_file_info(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_media_files_by_folder(TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_media_files_by_folder(TEXT, INTEGER) TO authenticated;

