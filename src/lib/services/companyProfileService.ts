import { supabase, supabaseAdmin } from '@/lib/supabase'
import { CompanyProfile, CompanyService, CompanyTeam, CompanyAchievement, CompanyContact } from '@/types/database'

export class CompanyProfileService {
  // Company Profile CRUD
  static async getCompanyProfile(): Promise<CompanyProfile | null> {
    const { data, error } = await supabase
      .from('company_profiles')
      .select('*')
      .single()
    
    if (error) {
      console.error('Error fetching company profile:', error)
      return null
    }
    
    return data
  }

  static async updateCompanyProfile(updates: Partial<CompanyProfile>): Promise<CompanyProfile | null> {
    const { data, error } = await supabaseAdmin
      .from('company_profiles')
      .update(updates)
      .eq('id', (await this.getCompanyProfile())?.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating company profile:', error)
      return null
    }
    
    return data
  }

  // Company Services CRUD
  static async getServices(): Promise<CompanyService[]> {
    const { data, error } = await supabase
      .from('company_services')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching services:', error)
      return []
    }
    
    return data || []
  }

  static async createService(service: Omit<CompanyService, 'id' | 'created_at' | 'updated_at'>): Promise<CompanyService | null> {
    const { data, error } = await supabaseAdmin
      .from('company_services')
      .insert(service)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating service:', error)
      return null
    }
    
    return data
  }

  static async updateService(id: string, updates: Partial<CompanyService>): Promise<CompanyService | null> {
    const { data, error } = await supabaseAdmin
      .from('company_services')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating service:', error)
      return null
    }
    
    return data
  }

  static async deleteService(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('company_services')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting service:', error)
      return false
    }
    
    return true
  }

  // Company Team CRUD
  static async getTeam(): Promise<CompanyTeam[]> {
    const { data, error } = await supabase
      .from('company_teams')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error fetching team:', error)
      return []
    }
    
    return data || []
  }

  static async createTeamMember(member: Omit<CompanyTeam, 'id' | 'created_at' | 'updated_at'>): Promise<CompanyTeam | null> {
    const { data, error } = await supabaseAdmin
      .from('company_teams')
      .insert(member)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating team member:', error)
      return null
    }
    
    return data
  }

  static async updateTeamMember(id: string, updates: Partial<CompanyTeam>): Promise<CompanyTeam | null> {
    const { data, error } = await supabaseAdmin
      .from('company_teams')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating team member:', error)
      return null
    }
    
    return data
  }

  static async deleteTeamMember(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('company_teams')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting team member:', error)
      return false
    }
    
    return true
  }

  // Company Achievements CRUD
  static async getAchievements(): Promise<CompanyAchievement[]> {
    const { data, error } = await supabase
      .from('company_achievements')
      .select('*')
      .order('year', { ascending: false })
    
    if (error) {
      console.error('Error fetching achievements:', error)
      return []
    }
    
    return data || []
  }

  static async createAchievement(achievement: Omit<CompanyAchievement, 'id' | 'created_at' | 'updated_at'>): Promise<CompanyAchievement | null> {
    const { data, error } = await supabaseAdmin
      .from('company_achievements')
      .insert(achievement)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating achievement:', error)
      return null
    }
    
    return data
  }

  static async updateAchievement(id: string, updates: Partial<CompanyAchievement>): Promise<CompanyAchievement | null> {
    const { data, error } = await supabaseAdmin
      .from('company_achievements')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating achievement:', error)
      return null
    }
    
    return data
  }

  static async deleteAchievement(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('company_achievements')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting achievement:', error)
      return false
    }
    
    return true
  }

  // Company Contact CRUD
  static async submitContact(contact: Omit<CompanyContact, 'id' | 'created_at'>): Promise<CompanyContact | null> {
    const { data, error } = await supabase
      .from('company_contacts')
      .insert(contact)
      .select()
      .single()
    
    if (error) {
      console.error('Error submitting contact:', error)
      return null
    }
    
    return data
  }

  static async getContacts(): Promise<CompanyContact[]> {
    const { data, error } = await supabaseAdmin
      .from('company_contacts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching contacts:', error)
      return []
    }
    
    return data || []
  }

  static async deleteContact(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('company_contacts')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting contact:', error)
      return false
    }
    
    return true
  }
}
