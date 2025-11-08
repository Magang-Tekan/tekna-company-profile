-- Migration: Extensions
-- Description: Enable required PostgreSQL extensions
-- Created: 2025-08-25

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

