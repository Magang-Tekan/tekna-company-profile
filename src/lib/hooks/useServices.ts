import { useState, useEffect } from 'react'
import { CompanyProfileService } from '@/lib/services/companyProfileService'
import { CompanyService } from '@/types/database'

export const useServices = () => {
  const [services, setServices] = useState<CompanyService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await CompanyProfileService.getServices()
      setServices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  const createService = async (service: Omit<CompanyService, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null)
      const newService = await CompanyProfileService.createService(service)
      if (newService) {
        setServices(prev => [...prev, newService])
        return { success: true, data: newService }
      }
      return { success: false, error: 'Failed to create service' }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create service'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const updateService = async (id: string, updates: Partial<CompanyService>) => {
    try {
      setError(null)
      const updatedService = await CompanyProfileService.updateService(id, updates)
      if (updatedService) {
        setServices(prev => prev.map(service => 
          service.id === id ? updatedService : service
        ))
        return { success: true, data: updatedService }
      }
      return { success: false, error: 'Failed to update service' }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update service'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const deleteService = async (id: string) => {
    try {
      setError(null)
      const success = await CompanyProfileService.deleteService(id)
      if (success) {
        setServices(prev => prev.filter(service => service.id !== id))
        return { success: true }
      }
      return { success: false, error: 'Failed to delete service' }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete service'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
    refetch: fetchServices
  }
}
