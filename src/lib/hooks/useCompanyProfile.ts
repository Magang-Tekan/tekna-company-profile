import { useState, useEffect } from 'react'
import { CompanyProfileService } from '@/lib/services/companyProfileService'
import { CompanyProfile } from '@/types/database'

export const useCompanyProfile = () => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await CompanyProfileService.getCompanyProfile()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<CompanyProfile>) => {
    try {
      setError(null)
      const updatedProfile = await CompanyProfileService.updateCompanyProfile(updates)
      if (updatedProfile) {
        setProfile(updatedProfile)
        return { success: true, data: updatedProfile }
      }
      return { success: false, error: 'Failed to update profile' }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    refetch: fetchProfile
  }
}
