-- Migration: Add Project Value Field
-- Description: Add project_value field to projects table for project pricing/value information
-- Created: 2025-01-28

-- Add project_value column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_value VARCHAR(255);

-- Add comment for documentation
COMMENT ON COLUMN projects.project_value IS 'Project value or pricing information (e.g., $50,000, €30,000, etc.)';

-- Update the updated_at timestamp trigger to include new column
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Recreate trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_projects_updated_at_trigger ON projects;
CREATE TRIGGER update_projects_updated_at_trigger
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_projects_updated_at();
