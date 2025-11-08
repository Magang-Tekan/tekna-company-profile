-- Migration: Partners System
-- Description: Simple partners table for logo management
-- Created: 2025-08-26

-- =====================================================
-- PARTNERS TABLE
-- =====================================================

-- Partners table (simplified - only logo and timestamps)
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    logo_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Partners policies: allow anyone to select logos, management restricted
CREATE POLICY "Anyone can view partners (logos)" ON partners
    FOR SELECT USING (true);

CREATE POLICY "Partners admin editor manage" ON partners
    FOR ALL USING ((select get_user_role(auth.uid())) IN ('admin', 'editor'));

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamp trigger for partners
-- Uses the standard update_updated_at_column() function defined in initial_schema.sql
CREATE TRIGGER trigger_update_partners_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

