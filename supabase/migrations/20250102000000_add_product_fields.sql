-- Migration: Add Product Fields
-- Description: Add is_product and product_price columns to projects table
-- Created: 2025-01-02

-- =====================================================
-- PRODUCT FIELDS
-- =====================================================

-- Add is_product column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_product BOOLEAN DEFAULT FALSE;

-- Add product_price column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS product_price VARCHAR(255);

-- Add comments for documentation
COMMENT ON COLUMN projects.is_product IS 'Indicates if this project is a product (true) or regular project (false/null). Products appear in /products, projects appear in /projects';
COMMENT ON COLUMN projects.product_price IS 'Product price information (e.g., "3 jutaan", "Rp 5 juta", etc.)';

-- Create index for filtering products vs projects
CREATE INDEX IF NOT EXISTS idx_projects_is_product ON projects(is_product) WHERE is_active = true;

