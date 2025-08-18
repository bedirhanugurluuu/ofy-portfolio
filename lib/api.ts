import { supabase } from './supabase';

// TypeScript interfaces
export interface Project {
  id: string; // UUID for Supabase
  title: string;
  subtitle: string;
  description: string;
  category: string;
  client: string;
  year: number;
  image_path?: string;
  video_path?: string;
  slug: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface IntroBanner {
  id: string; // UUID for Supabase
  title: string;
  subtitle: string;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: string; // UUID for Supabase
  title: string;
  subtitle: string;
  description: string;
  image_path?: string;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string; // UUID for Supabase
  title: string;
  subtitle: string;
  content: string;
  image_path?: string;
  slug: string;
  featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface AboutGalleryImage {
  id: string; // UUID for Supabase
  title: string;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Award {
  id: string; // UUID for Supabase
  title: string;
  description: string;
  year: number;
  image_path?: string;
  created_at: string;
  updated_at: string;
}

export interface SliderItem {
  id: string; // UUID for Supabase
  title: string;
  subtitle: string;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface WhatWeDoContent {
  id: string; // UUID for Supabase
  title: string;
  subtitle: string;
  service_1_title: string;
  service_1_items: string;
  service_2_title: string;
  service_2_items: string;
  service_3_title: string;
  service_3_items: string;
  created_at: string;
  updated_at: string;
}

export interface ContactContent {
  id: string; // UUID for Supabase
  phone: string;
  email: string;
  instagram: string;
  linkedin: string;
  address_line1: string;
  address_line2: string;
  studio_hours_weekdays: string;
  studio_hours_weekend: string;
  image_path?: string;
  created_at: string;
  updated_at: string;
}

// Görsel URL'lerini normalize eden utility fonksiyonu
export const normalizeImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  let p = imagePath.trim();
  if (!p) return "";

  // http veya data URL ise direkt döndür (Supabase Storage URL'leri dahil)
  if (/^(https?:)?\/\//i.test(p) || p.startsWith("data:")) return p;

  // Eğer local uploads path ise, Supabase Storage URL'ine dönüştür
  if (p.startsWith("/uploads/")) {
    // Bu durumda eski local dosyalar için fallback
    return `http://localhost:3000${p}`;
  }

  // Diğer durumlar için Supabase Storage URL formatı
  return p;
};

// Supabase API functions
export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function fetchProjectsSSR(): Promise<Project[]> {
  return fetchProjects();
}

export async function fetchIntroBanners(): Promise<IntroBanner[]> {
  const { data, error } = await supabase
    .from('intro_banners')
    .select('*')
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function fetchIntroBannersSSR(): Promise<IntroBanner[]> {
  return fetchIntroBanners();
}

export async function fetchProjectBySlug(slug: string): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

export async function fetchProjectBySlugSSR(slug: string): Promise<Project> {
  return fetchProjectBySlug(slug);
}

export async function fetchAbout(): Promise<AboutContent> {
  const { data, error } = await supabase
    .from('about')
    .select('*')
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data || {
    id: '',
    title: 'About Us',
    subtitle: 'We are a creative studio',
    description: 'Default description',
    image_path: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export async function fetchNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function fetchFeaturedNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('featured', true)
    .order('published_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function fetchNewsBySlug(slug: string): Promise<News> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

export async function fetchAboutGallery(): Promise<AboutGalleryImage[]> {
  const { data, error } = await supabase
    .from('about_gallery')
    .select('*')
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function fetchAwards(): Promise<Award[]> {
  const { data, error } = await supabase
    .from('awards')
    .select('*')
    .order('year', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function fetchSlider(): Promise<SliderItem[]> {
  const { data, error } = await supabase
    .from('slider')
    .select('*')
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function fetchWhatWeDo(): Promise<WhatWeDoContent> {
  const { data, error } = await supabase
    .from('what_we_do')
    .select('*')
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data || {
    id: '',
    title: 'What We Do',
    subtitle: 'We create digital experiences that matter',
    service_1_title: 'Brand Strategy',
    service_1_items: 'Brand Audit\nResearch\nAudience\nCompetitive Analysis\nPositioning\nTone of Voice\nSocial Media',
    service_2_title: 'Digital Design',
    service_2_items: 'UI/UX Design\nWeb Design\nMobile Design\nBrand Identity\nPrint Design\nPackaging\nIllustration',
    service_3_title: 'Development',
    service_3_items: 'Frontend Development\nBackend Development\nE-commerce\nCMS Integration\nAPI Development\nPerformance Optimization\nMaintenance',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export async function fetchContact(): Promise<ContactContent> {
  const { data, error } = await supabase
    .from('contact')
    .select('*')
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data || {
    id: '',
    phone: '+45 123 456 789',
    email: 'hello@lucastudio.com',
    instagram: 'https://instagram.com/lucastudio',
    linkedin: 'https://linkedin.com/company/lucastudio',
    address_line1: '12 Nyhavn Street',
    address_line2: 'Copenhagen, Denmark, 1051',
    studio_hours_weekdays: 'Monday to Friday: 9:00 AM – 6:00 PM',
    studio_hours_weekend: 'Saturday & Sunday: Closed',
    image_path: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}
