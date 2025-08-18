import axios from "axios";

// TypeScript interfaces
export interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image_path?: string;
  thumbnail_media?: string;
  banner_media?: string;
  video_url?: string;
  role?: string;
  slug: string;
  featured?: boolean;
  is_featured?: boolean;
  featured_order?: number;
  client_name?: string;
  year?: number;
  external_link?: string;
  created_at: string;
  updated_at: string;
}

export interface IntroBanner {
  id: number;
  title: string;
  subtitle: string;
  image_path?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AboutContent {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  image_path?: string;
  main_text: string;
  vision_title: string;
  vision_text: string;
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
  id: number;
  title: string;
  subtitle: string;
  content: string;
  image_path?: string;
  slug: string;
  category_text: string;
  photographer: string;
  is_featured?: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface AboutGalleryImage {
  id: number;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Award {
  id: number;
  title: string;
  description: string;
  image_path?: string;
  year: string;
  created_at: string;
  updated_at: string;
}

export interface SliderItem {
  id: number;
  title: string;
  subtitle: string;
  sub_subtitle?: string;
  image_path?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface WhatWeDoContent {
  id: number;
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
  id: number;
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

// Server-side API base URL (for SSR)
const getServerApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: Use absolute URL
    return process.env.NEXT_PUBLIC_API_BASE_URL || "https://ofy-portfolio-h97t.vercel.app/api";
  }
  // Client-side: Use relative URL
  return "/api";
};

// Görsel URL'lerini backend base URL ile birleştiren utility fonksiyonu
export const normalizeImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  let p = imagePath.trim();
  if (!p) return "";

  // http veya data URL ise direkt döndür
  if (/^(https?:)?\/\//i.test(p) || p.startsWith("data:")) return p;

  // Windows backslash -> forward slash
  p = p.replace(/\\/g, "/");

  // Başta tekrarlı uploads öneklerini tekilleştir (uploads/ ... bir veya daha fazla tekrar)
  p = p.replace(/^\/?(?:uploads\/)+/, "/uploads/");

  // Eğer hala /uploads/ ile başlamıyorsa ekle
  if (!p.startsWith("/uploads/")) {
    // Baştaki / işaretlerini kırpıp /uploads/ ekle
    p = "/uploads/" + p.replace(/^\/+/, "");
  }

  return `${API_BASE_URL}${p}`;
};

// Server-side API functions (for SSR)
export async function fetchProjectsSSR(): Promise<Project[]> {
  const baseUrl = getServerApiBaseUrl();
  const res = await axios.get<Project[]>(`${baseUrl}/projects`);
  return res.data;
}

export async function fetchIntroBannersSSR(): Promise<IntroBanner[]> {
  const baseUrl = getServerApiBaseUrl();
  const res = await axios.get<IntroBanner[]>(`${baseUrl}/intro-banners`);
  return res.data;
}

// Client-side API functions
export async function fetchProjects(): Promise<Project[]> {
  const res = await axios.get<Project[]>(`${API_BASE_URL}/projects`);
  return res.data;
}

export async function fetchIntroBanners(): Promise<IntroBanner[]> {
  const res = await axios.get<IntroBanner[]>(`${API_BASE_URL}/intro-banners`);
  return res.data;
}

export async function fetchProjectBySlug(slug: string): Promise<Project> {
  const res = await axios.get<Project>(`${API_BASE_URL}/projects/${slug}`);
  return res.data;
}

export async function fetchProjectBySlugSSR(slug: string): Promise<Project> {
  const baseUrl = getServerApiBaseUrl();
  const res = await axios.get<Project>(`${baseUrl}/projects/${slug}`);
  return res.data;
}

export async function fetchAbout(): Promise<AboutContent> {
  const res = await axios.get<AboutContent>(`${API_BASE_URL}/about`);
  return res.data;
}

export async function fetchNews(): Promise<News[]> {
  const res = await axios.get<News[]>(`${API_BASE_URL}/news`);
  return res.data;
}

export async function fetchFeaturedNews(): Promise<News[]> {
  const res = await axios.get<News[]>(`${API_BASE_URL}/news/featured`);
  return res.data;
}

export async function fetchNewsBySlug(slug: string): Promise<News> {
  const res = await axios.get<News>(`${API_BASE_URL}/news/slug/${slug}`);
  return res.data;
}

export async function fetchAboutGallery(): Promise<AboutGalleryImage[]> {
  const res = await axios.get<AboutGalleryImage[]>(`${API_BASE_URL}/about-gallery`);
  return res.data;
}

export async function fetchAwards(): Promise<Award[]> {
  const res = await axios.get<Award[]>(`${API_BASE_URL}/awards`);
  return res.data;
}

export async function fetchSlider(): Promise<SliderItem[]> {
  const res = await axios.get<SliderItem[]>(`${API_BASE_URL}/slider`);
  return res.data;
}

export async function fetchWhatWeDo(): Promise<WhatWeDoContent> {
  const res = await axios.get<WhatWeDoContent>(`${API_BASE_URL}/what-we-do`);
  return res.data;
}

export async function fetchContact(): Promise<ContactContent> {
  const res = await axios.get<ContactContent>(`${API_BASE_URL}/contact`);
  return res.data;
}
