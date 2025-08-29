import { supabase } from './supabase';

// TypeScript interfaces
export interface Project {
  id: string; // UUID for Supabase
  title: string;
  subtitle: string;
  description: string;
  thumbnail_media?: string;
  banner_media?: string;
  video_url?: string;
  is_featured: boolean;
  featured_order?: number;
  client_name?: string;
  year?: number;
  role?: string;
  external_link?: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface IntroBanner {
  id: string;
  title_line1: string;
  title_line2: string;
  button_text: string;
  button_link: string;
  image: string; // intro_banners tablosunda alan adı 'image'
  order_index: number;
  scroll_text?: string; // "Scroll to view more" metni
  project_id?: string; // Bağlantılı proje ID'si
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  description: string;
  main_text: string;
  vision_title: string;
  vision_text: string;
  image_path?: string;
  approach_title: string;
  approach_subtitle: string;
  brand_strategy_title: string;
  brand_strategy_text: string;
  visual_design_title: string;
  visual_design_text: string;
  launch_title: string;
  launch_text: string;
  insights_title: string;
  insights_subtitle: string;
  insight_1_title: string;
  insight_1_text: string;
  insight_1_project_id: number;
  insight_2_title: string;
  insight_2_text: string;
  insight_2_project_id: number;
  insight_3_title: string;
  insight_3_text: string;
  insight_3_project_id: number;
  insight_4_title: string;
  insight_4_text: string;
  insight_4_project_id: number;
  clients_title: string;
  clients_list: string;
  industries_title: string;
  industries_list: string;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  image_path?: string;
  aspect_ratio?: string;
  category_text?: string;
  photographer?: string;
  published_at?: string;
  slug: string;
  is_featured: boolean;
  featured_order?: number;
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
  link: string;
  date: string;
  subtitle: string;
  halo: string;
  image_path?: string;
  year?: number;
  created_at: string;
  updated_at: string;
}

export interface SliderItem {
  id: string;
  title: string;
  subtitle: string;
  sub_subtitle: string;
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
  title: string;
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

  // Eğer zaten tam URL ise (http/https ile başlıyorsa) direkt döndür
  if (p.startsWith("http://") || p.startsWith("https://")) {
    return p;
  }

  // Eğer data URL ise direkt döndür
  if (p.startsWith("data:")) {
    return p;
  }

  // Eğer Supabase Storage URL formatında ise direkt döndür
  if (p.includes("supabase.co/storage/v1/object/public/")) {
    return p;
  }

  // Eğer local path ise (/uploads/ ile başlıyorsa) Supabase URL'ine dönüştür
  if (p.startsWith("/uploads/")) {
    const fileName = p.replace("/uploads/", "");
    return `https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/${fileName}`;
  }

  // Eğer sadece dosya adı ise, uploads bucket'ına yönlendir
  if (!p.includes("/") && !p.includes("\\")) {
    return `https://lsxafginsylkeuyzuiau.supabase.co/storage/v1/object/public/uploads/${p}`;
  }

  // Diğer durumlar için fallback
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
    .order('featured_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const raw = decodeURIComponent(slug || "").trim();

  // Single optimized query with case-insensitive match
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .ilike('slug', raw)
    .single();

  if (error) throw error;
  return data as Project;
}

export async function fetchProjectGallery(projectId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('project_gallery')
    .select('image_path')
    .eq('project_id', projectId)
    .order('sort', { ascending: true });

  if (error) throw error;
  return data?.map(item => item.image_path) || [];
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
    .from('about_content')
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
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchSlider(): Promise<SliderItem[]> {
  const { data, error } = await supabase
    .from('about_slider')
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

// SSR versions for getServerSideProps
export async function fetchProjectBySlugSSR(slug: string): Promise<Project | null> {
  return fetchProjectBySlug(slug);
}

export async function fetchNewsBySlugSSR(slug: string): Promise<News | null> {
  return fetchNewsBySlug(slug);
}

export async function fetchNewsSSR(): Promise<News[]> {
  return fetchNews();
}
