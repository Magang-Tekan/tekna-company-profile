export interface CompanyProfile {
  id: string
  name: string
  description: string
  vision: string
  mission: string
  founded_year: number
  employee_count: number
  industry: string
  website: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  logo_url?: string
  banner_url?: string
  created_at: string
  updated_at: string
}

export interface CompanyService {
  id: string
  company_id: string
  name: string
  description: string
  icon?: string
  created_at: string
  updated_at: string
}

export interface CompanyTeam {
  id: string
  company_id: string
  name: string
  position: string
  bio: string
  photo_url?: string
  linkedin_url?: string
  email?: string
  created_at: string
  updated_at: string
}

export interface CompanyAchievement {
  id: string
  company_id: string
  title: string
  description: string
  year: number
  image_url?: string
  created_at: string
  updated_at: string
}

export interface CompanyContact {
  id: string
  company_id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      company_profiles: {
        Row: CompanyProfile
        Insert: Omit<CompanyProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CompanyProfile, 'id' | 'created_at' | 'updated_at'>>
      }
      company_services: {
        Row: CompanyService
        Insert: Omit<CompanyService, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CompanyService, 'id' | 'created_at' | 'updated_at'>>
      }
      company_teams: {
        Row: CompanyTeam
        Insert: Omit<CompanyTeam, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CompanyTeam, 'id' | 'created_at' | 'updated_at'>>
      }
      company_achievements: {
        Row: CompanyAchievement
        Insert: Omit<CompanyAchievement, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CompanyAchievement, 'id' | 'created_at' | 'updated_at'>>
      }
      company_contacts: {
        Row: CompanyContact
        Insert: Omit<CompanyContact, 'id' | 'created_at'>
        Update: Partial<Omit<CompanyContact, 'id' | 'created_at'>>
      }
    }
  }
}
