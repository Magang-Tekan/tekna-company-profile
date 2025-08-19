-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Company Profiles Table
CREATE TABLE IF NOT EXISTS company_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  vision TEXT,
  mission TEXT,
  founded_year INTEGER,
  employee_count INTEGER,
  industry VARCHAR(255),
  website VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(255),
  country VARCHAR(255),
  logo_url TEXT,
  banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Services Table
CREATE TABLE IF NOT EXISTS company_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Team Table
CREATE TABLE IF NOT EXISTS company_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  bio TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Achievements Table
CREATE TABLE IF NOT EXISTS company_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  year INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Contacts Table
CREATE TABLE IF NOT EXISTS company_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_company_services_company_id ON company_services(company_id);
CREATE INDEX IF NOT EXISTS idx_company_teams_company_id ON company_teams(company_id);
CREATE INDEX IF NOT EXISTS idx_company_achievements_company_id ON company_achievements(company_id);
CREATE INDEX IF NOT EXISTS idx_company_contacts_company_id ON company_contacts(company_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON company_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_services_updated_at BEFORE UPDATE ON company_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_teams_updated_at BEFORE UPDATE ON company_teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_achievements_updated_at BEFORE UPDATE ON company_achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for company profile
INSERT INTO company_profiles (
  name, description, vision, mission, founded_year, employee_count, 
  industry, website, email, phone, address, city, country
) VALUES (
  'Tekna Solutions',
  'Perusahaan teknologi terdepan yang berfokus pada solusi digital inovatif untuk bisnis modern.',
  'Menjadi pemimpin dalam transformasi digital yang memberdayakan bisnis untuk berkembang di era teknologi.',
  'Memberikan solusi teknologi berkualitas tinggi yang memudahkan operasional bisnis dan meningkatkan efisiensi.',
  2020,
  50,
  'Technology',
  'https://tekna.com',
  'info@tekna.com',
  '+62-21-1234-5678',
  'Jl. Sudirman No. 123',
  'Jakarta',
  'Indonesia'
) ON CONFLICT DO NOTHING;
