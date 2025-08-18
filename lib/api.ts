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
  id: string;
  title: string;
  subtitle: string;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_path?: string;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  image_path?: string;
  slug: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface AboutGalleryImage {
  id: string;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Award {
  id: string;
  title: string;
  description: string;
  image_path?: string;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface WhatWeDoContent {
  id: string;
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
  id: string;
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

  // http veya data URL ise direkt döndür (Supabase Storage URL'leri dahil)
  if (/^(https?:)?\/\//i.test(p) || p.startsWith("data:")) return p;

  // Eğer local uploads path ise, Supabase Storage URL'ine dönüştür
  if (p.startsWith("/uploads/")) {
    // Bu durumda eski local dosyalar için fallback
    return `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${p}`;
  }

  // Diğer durumlar için Supabase Storage URL formatı
  return p;
};

// Client-side API functions
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

export async function fetchFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
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

export async function fetchAbout(): Promise<AboutContent | null> {
  const { data, error } = await supabase
    .from('about')
    .select('*')
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function fetchAboutContent(): Promise<AboutContent | null> {
  return fetchAbout();
}

export async function fetchAboutGallery(): Promise<AboutGalleryImage[]> {
  const { data, error } = await supabase
    .from('about_gallery')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchFeaturedNews(): Promise<News[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchNewsBySlug(slug: string): Promise<News | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
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

export async function fetchSliderItems(): Promise<SliderItem[]> {
  return fetchSlider();
}

export async function fetchWhatWeDo(): Promise<WhatWeDoContent | null> {
  const { data, error } = await supabase
    .from('what_we_do')
    .select('*')
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function fetchWhatWeDoContent(): Promise<WhatWeDoContent | null> {
  return fetchWhatWeDo();
}

export async function fetchContact(): Promise<ContactContent | null> {
  const { data, error } = await supabase
    .from('contact')
    .select('*')
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function fetchContactContent(): Promise<ContactContent | null> {
  return fetchContact();
}
