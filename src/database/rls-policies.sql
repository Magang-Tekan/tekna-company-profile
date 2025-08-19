-- Row Level Security Policies untuk Company Profile

-- Enable RLS untuk semua tabel
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies jika ada
DROP POLICY IF EXISTS "Allow public read access" ON company_profiles;
DROP POLICY IF EXISTS "Allow public read access" ON company_services;
DROP POLICY IF EXISTS "Allow public read access" ON company_teams;
DROP POLICY IF EXISTS "Allow public read access" ON company_achievements;
DROP POLICY IF EXISTS "Allow public insert access" ON company_contacts;

DROP POLICY IF EXISTS "Allow admin full access" ON company_profiles;
DROP POLICY IF EXISTS "Allow admin full access" ON company_services;
DROP POLICY IF EXISTS "Allow admin full access" ON company_teams;
DROP POLICY IF EXISTS "Allow admin full access" ON company_achievements;
DROP POLICY IF EXISTS "Allow admin full access" ON company_contacts;

-- Public read policies
CREATE POLICY "Allow public read access" ON company_profiles 
FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON company_services 
FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON company_teams 
FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON company_achievements 
FOR SELECT USING (true);

-- Public insert policy untuk contact form
CREATE POLICY "Allow public insert access" ON company_contacts 
FOR INSERT WITH CHECK (true);

-- Admin full access policies (menggunakan service role key)
CREATE POLICY "Allow admin full access" ON company_profiles 
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow admin full access" ON company_services 
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow admin full access" ON company_teams 
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow admin full access" ON company_achievements 
FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow admin full access" ON company_contacts 
FOR ALL USING (auth.role() = 'service_role');

-- Verifikasi policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('company_profiles', 'company_services', 'company_teams', 'company_achievements', 'company_contacts')
ORDER BY tablename, policyname;
