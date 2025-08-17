import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

// GÃ¶rsel URL'lerini backend base URL ile birleÅŸtiren utility fonksiyonu
export const normalizeImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";
  let p = imagePath.trim();
  if (!p) return "";

  // http veya data URL ise direkt dÃ¶ndÃ¼r
  if (/^(https?:)?\/\//i.test(p) || p.startsWith("data:")) return p;

  // Windows backslash -> forward slash
  p = p.replace(/\\/g, "/");

  // BaÅŸta tekrarlÄ± uploads Ã¶neklerini tekilleÅŸtir (uploads/ ... bir veya daha fazla tekrar)
  p = p.replace(/^\/?(?:uploads\/)+/, "/uploads/");

  // EÄŸer hala /uploads/ ile baÅŸlamÄ±yorsa ekle
  if (!p.startsWith("/uploads/")) {
    // BaÅŸtaki / iÅŸaretlerini kÄ±rpÄ±p /uploads/ ekle
    p = "/uploads/" + p.replace(/^\/+/, "");
  }

  return ${API_BASE_URL};
};

export async function fetchProjects(): Promise<Project[]> {
  const res = await axios.get<Project[]>(${API_BASE_URL}/projects);
  return res.data;
}

export async function fetchProjectBySlug(slug: string): Promise<Project> {
  const res = await axios.get<Project>(${API_BASE_URL}/projects/);
  return res.data;
}

export async function fetchIntroBanners(): Promise<IntroBanner[]> {
  const res = await axios.get<IntroBanner[]>(${API_BASE_URL}/intro-banners);
  return res.data;
}

export async function fetchAbout(): Promise<AboutContent> {
  const res = await axios.get<AboutContent>(${API_BASE_URL}/about);
  return res.data;
}

export async function fetchNews(): Promise<News[]> {
  const res = await axios.get<News[]>(${API_BASE_URL}/news);
  return res.data;
}

export async function fetchFeaturedNews(): Promise<News[]> {
  const res = await axios.get<News[]>(${API_BASE_URL}/news/featured);
  return res.data;
}

export async function fetchNewsBySlug(slug: string): Promise<News> {
  const res = await axios.get<News>(${API_BASE_URL}/news/slug/);
  return res.data;
}

export async function fetchAboutGallery(): Promise<AboutGalleryImage[]> {
  const res = await axios.get<AboutGalleryImage[]>(${API_BASE_URL}/about-gallery);
  return res.data;
}

export async function fetchAwards(): Promise<Award[]> {
  const res = await axios.get<Award[]>(${API_BASE_URL}/awards);
  return res.data;
}

export async function fetchSlider(): Promise<SliderItem[]> {
  const res = await axios.get<SliderItem[]>(${API_BASE_URL}/slider);
  return res.data;
}

export async function fetchWhatWeDo(): Promise<WhatWeDoContent> {
  const res = await axios.get<WhatWeDoContent>(${API_BASE_URL}/what-we-do);
  return res.data;
}

export async function fetchContact(): Promise<ContactContent> {
  const res = await axios.get<ContactContent>(${API_BASE_URL}/contact);
  return res.data;
}
