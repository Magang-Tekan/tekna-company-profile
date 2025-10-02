import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GlobeConfig, SampleArc, Partner, Project, ContactForm, ContentOpacity } from '@/lib/types/landing';

// Types untuk landing page state
interface LandingState {
  // Globe state
  globeConfig: GlobeConfig | null;
  sampleArcs: SampleArc[];
  shouldRenderGlobe: boolean;
  
  // Hero section state
  contentOpacity: ContentOpacity;
  
  // Partners data
  partners: Partner[];
  partnersLoading: boolean;
  
  // Projects data
  projects: Project[];
  projectsLoading: boolean;
  
  // Form state
  contactForm: ContactForm;
  dialogOpen: boolean;
  
  // Actions
  setGlobeConfig: (config: GlobeConfig | null) => void;
  setSampleArcs: (arcs: SampleArc[]) => void;
  setShouldRenderGlobe: (should: boolean) => void;
  
  setContentOpacity: (opacity: ContentOpacity) => void;
  
  setPartners: (partners: Partner[]) => void;
  setPartnersLoading: (loading: boolean) => void;
  
  setProjects: (projects: Project[]) => void;
  setProjectsLoading: (loading: boolean) => void;
  
  setContactForm: (form: Partial<ContactForm>) => void;
  resetContactForm: () => void;
  setDialogOpen: (open: boolean) => void;
  
  // Reset all state
  resetLandingState: () => void;
}

// Initial state
const initialState = {
  globeConfig: null,
  sampleArcs: [],
  shouldRenderGlobe: false,
  
  contentOpacity: {
    content1: 1,
    content2: 0,
    content3: 0,
  },
  
  partners: [],
  partnersLoading: true,
  
  projects: [],
  projectsLoading: true,
  
  contactForm: {
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  },
  dialogOpen: false,
};

export const useLandingStore = create<LandingState>()(
  persist(
    (set) => ({
      ...initialState,
      
      // Globe actions
      setGlobeConfig: (config) => set({ globeConfig: config }),
      setSampleArcs: (arcs) => set({ sampleArcs: arcs }),
      setShouldRenderGlobe: (should) => set({ shouldRenderGlobe: should }),
      
      // Content opacity actions
      setContentOpacity: (opacity) => set({ contentOpacity: opacity }),
      
      // Partners actions
      setPartners: (partners) => set({ partners }),
      setPartnersLoading: (loading) => set({ partnersLoading: loading }),
      
      // Projects actions
      setProjects: (projects) => set({ projects }),
      setProjectsLoading: (loading) => set({ projectsLoading: loading }),
      
      // Contact form actions
      setContactForm: (form) => set((state) => ({ 
        contactForm: { ...state.contactForm, ...form } 
      })),
      resetContactForm: () => set({ contactForm: initialState.contactForm }),
      setDialogOpen: (open) => set({ dialogOpen: open }),
      
      // Reset all state
      resetLandingState: () => set(initialState),
    }),
    {
      name: 'landing-store',
      // Hanya persist data yang penting, tidak perlu persist loading states
      partialize: (state) => ({
        globeConfig: state.globeConfig,
        sampleArcs: state.sampleArcs,
        partners: state.partners,
        projects: state.projects,
      }),
      // Set expiration time untuk mencegah stale data
      version: 1,
    }
  )
);

// Optimized selectors untuk mencegah infinite loop
export const useGlobeState = () => {
  const globeConfig = useLandingStore((state) => state.globeConfig);
  const sampleArcs = useLandingStore((state) => state.sampleArcs);
  const shouldRenderGlobe = useLandingStore((state) => state.shouldRenderGlobe);
  const setGlobeConfig = useLandingStore((state) => state.setGlobeConfig);
  const setSampleArcs = useLandingStore((state) => state.setSampleArcs);
  const setShouldRenderGlobe = useLandingStore((state) => state.setShouldRenderGlobe);
  
  return {
    globeConfig,
    sampleArcs,
    shouldRenderGlobe,
    setGlobeConfig,
    setSampleArcs,
    setShouldRenderGlobe,
  };
};

export const useHeroState = () => {
  const contentOpacity = useLandingStore((state) => state.contentOpacity);
  const setContentOpacity = useLandingStore((state) => state.setContentOpacity);
  
  return {
    contentOpacity,
    setContentOpacity,
  };
};

export const usePartnersState = () => {
  const partners = useLandingStore((state) => state.partners);
  const partnersLoading = useLandingStore((state) => state.partnersLoading);
  const setPartners = useLandingStore((state) => state.setPartners);
  const setPartnersLoading = useLandingStore((state) => state.setPartnersLoading);
  
  return {
    partners,
    partnersLoading,
    setPartners,
    setPartnersLoading,
  };
};

export const useProjectsState = () => {
  const projects = useLandingStore((state) => state.projects);
  const projectsLoading = useLandingStore((state) => state.projectsLoading);
  const setProjects = useLandingStore((state) => state.setProjects);
  const setProjectsLoading = useLandingStore((state) => state.setProjectsLoading);
  
  return {
    projects,
    projectsLoading,
    setProjects,
    setProjectsLoading,
  };
};

export const useContactFormState = () => {
  const contactForm = useLandingStore((state) => state.contactForm);
  const dialogOpen = useLandingStore((state) => state.dialogOpen);
  const setContactForm = useLandingStore((state) => state.setContactForm);
  const resetContactForm = useLandingStore((state) => state.resetContactForm);
  const setDialogOpen = useLandingStore((state) => state.setDialogOpen);
  
  return {
    contactForm,
    dialogOpen,
    setContactForm,
    resetContactForm,
    setDialogOpen,
  };
};
