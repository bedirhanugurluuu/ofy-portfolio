import { supabase } from './supabase';

// TypeScript interfaces
export interface Project {
  id: string; // UUID for Supabase
  title: string;
  subtitle: string;
  description: string;
  thumbnail_media?: string;
  banner_media?: string; // Desktop banner (default)
  banner_media_mobile?: string; // Mobile banner (optional, falls back to banner_media if not set)
  video_url?: string;
  is_featured: boolean;
  featured_order?: number;
  order?: number; // Genel sıralama
  client_name?: string;
  year?: number;
  role?: string;
  external_link?: string;
  slug: string;
  subtitle_color?: string; // Subtitle rengi
  hide_subtitle?: boolean; // Subtitle'ı gizle (opacity-0)
  project_credits?: Array<{ role: string; name: string }>; // Projede ismi geçen kişiler
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
  image_mobile?: string; // Mobile görsel (sadece 3. banner için kullanılır)
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
  main_title: string;
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

export interface Service {
  id: string;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AboutBanner {
  id: string;
  image: string;
  title_desktop: string;
  title_mobile: string;
  button_text: string;
  button_link: string;
  created_at: string;
  updated_at: string;
}

export interface Footer {
  id: string;
  cta_title: string;
  cta_link: string;
  sitemap_items: Array<{ name: string; link: string }>;
  social_items: Array<{ name: string; link: string }>;
  copyright_text: string;
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
  social_items: Array<{ name: string; link: string }>;
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

// Supabase görseli olup olmadığını kontrol eden helper fonksiyon
// Supabase görselleri için Next.js Image Optimization kullanılmamalı (Vercel limiti için)
export const isSupabaseImage = (url: string): boolean => {
  if (!url) return false;
  return url.includes("supabase.co/storage/v1/object/public/");
};

// Client-side API functions
export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    // Eğer order kolonu yoksa, sadece created_at'e göre sırala
    if (error.code === '42703') {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (fallbackError) throw fallbackError;
      return fallbackData || [];
    }
    throw error;
  }
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

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchServicesSSR(): Promise<Service[]> {
  return fetchServices();
}

export async function fetchAboutBanner(): Promise<AboutBanner | null> {
  const { data, error } = await supabase
    .from('about_banner')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching about banner:', error);
    return null;
  }

  return data;
}

export async function updateAboutBanner(banner: Partial<AboutBanner>): Promise<AboutBanner | null> {
  const { data, error } = await supabase
    .from('about_banner')
    .upsert(banner)
    .select()
    .single();

  if (error) {
    console.error('Error updating about banner:', error);
    return null;
  }

  return data;
}

export async function fetchFooter(): Promise<Footer | null> {
  const { data, error } = await supabase
    .from('footer')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching footer:', error);
    return null;
  }

  return data;
}

export async function updateFooter(footer: Partial<Footer>): Promise<Footer | null> {
  const { data, error } = await supabase
    .from('footer')
    .upsert(footer)
    .select()
    .single();

  if (error) {
    console.error('Error updating footer:', error);
    return null;
  }

  return data;
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
  
  // Eğer data varsa ama social_items yoksa, fallback değer ekle
  if (data && !data.social_items) {
    return {
      ...data,
      social_items: [
        { name: "Instagram", link: "#" },
        { name: "LinkedIn", link: "#" }
      ]
    };
  }
  
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
