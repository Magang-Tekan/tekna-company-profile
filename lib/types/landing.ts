// Types untuk landing page

export interface GlobeConfig {
  pointSize: number;
  globeColor: string;
  showAtmosphere: boolean;
  atmosphereColor: string;
  atmosphereAltitude: number;
  emissive: string;
  emissiveIntensity: number;
  shininess: number;
  polygonColor: string;
  ambientLight: string;
  directionalLeftLight: string;
  directionalTopLight: string;
  pointLight: string;
  arcTime: number;
  arcLength: number;
  rings: number;
  maxRings: number;
  initialPosition: {
    lat: number;
    lng: number;
  };
  autoRotate: boolean;
  autoRotateSpeed: number;
}

export interface SampleArc {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
}

export interface Partner {
  id: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export interface ContentOpacity {
  content1: number;
  content2: number;
  content3: number;
}
