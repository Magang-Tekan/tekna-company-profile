import { useEffect } from 'react';
import useSWR from 'swr';
import { usePartnersState, useProjectsState } from '@/lib/stores/landing-store';
import { Partner, Project } from '@/lib/types/landing';

// Fetcher functions
const fetchers = {
  partners: (url: string) => fetch(url).then(res => res.json()),
  projects: (url: string) => fetch(url).then(res => res.json()),
};

// Custom hook untuk partners data dengan global state
export function usePartnersData() {
  const { partners, partnersLoading, setPartners, setPartnersLoading } = usePartnersState();
  
  const { data, error, isLoading } = useSWR(
    '/api/partners?limit=20',
    fetchers.partners,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5 * 60 * 1000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  useEffect(() => {
    if (data?.partners && Array.isArray(data.partners)) {
      // Filter partners yang memiliki logo_url
      const validPartners = data.partners.filter(
        (partner: Partner) => partner.logo_url && partner.logo_url.trim() !== ""
      );
      setPartners(validPartners);
    }
  }, [data, setPartners]);

  useEffect(() => {
    setPartnersLoading(isLoading);
  }, [isLoading, setPartnersLoading]);

  return {
    partners,
    loading: partnersLoading,
    error,
    // Force refresh function
    refresh: () => {
      setPartnersLoading(true);
    }
  };
}

// Custom hook untuk projects data dengan global state
export function useProjectsData() {
  const { projects, projectsLoading, setProjects, setProjectsLoading } = useProjectsState();
  
  const { data, error, isLoading } = useSWR(
    '/api/projects?featured=true',
    fetchers.projects,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 10 * 60 * 1000, // 10 minutes
      errorRetryCount: 3,
      errorRetryInterval: 1000,
    }
  );

  useEffect(() => {
    if (data?.projects && Array.isArray(data.projects)) {
      setProjects(data.projects as Project[]);
    }
  }, [data, setProjects]);

  useEffect(() => {
    setProjectsLoading(isLoading);
  }, [isLoading, setProjectsLoading]);

  return {
    projects,
    loading: projectsLoading,
    error,
    // Force refresh function
    refresh: () => {
      setProjectsLoading(true);
    }
  };
}

// Hook untuk mengelola cache expiration
export function useLandingCacheManager() {
  useEffect(() => {
    // Set up periodic cache cleanup
    const cleanup = setInterval(() => {
      // Clear old data jika diperlukan
      const now = Date.now();
      const lastAccess = localStorage.getItem('landing-store-last-access');
      
      if (lastAccess) {
        const timeDiff = now - parseInt(lastAccess);
        // Clear cache jika lebih dari 30 menit tidak diakses
        if (timeDiff > 30 * 60 * 1000) {
          localStorage.removeItem('landing-store');
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(cleanup);
  }, []);
}
