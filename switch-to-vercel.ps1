# Vercel Production Environment Switch Script
Write-Host "Switching to VERCEL production environment..." -ForegroundColor Green

# Ana proje - lib/api.ts
$apiContent = @"
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

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

export async function fetchProjects(): Promise<Project[]> {
  const res = await axios.get<Project[]>(`${API_BASE_URL}/projects`);
  return res.data;
}

export async function fetchProjectBySlug(slug: string): Promise<Project> {
  const res = await axios.get<Project>(`${API_BASE_URL}/projects/${slug}`);
  return res.data;
}

export async function fetchIntroBanners(): Promise<IntroBanner[]> {
  const res = await axios.get<IntroBanner[]>(`${API_BASE_URL}/intro-banners`);
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
"@

# Ana proje - lib/api.ts'yi güncelle
$apiContent | Out-File -FilePath "lib/api.ts" -Encoding UTF8

# Admin panel - .env
$adminEnvContent = @"
VITE_API_BASE_URL=https://ofy-portfolio-h97t.vercel.app
"@

# Admin panel - .env'yi güncelle
$adminEnvContent | Out-File -FilePath "admin-panel/.env" -Encoding UTF8

Write-Host "Switched to VERCEL environment!" -ForegroundColor Green
Write-Host "Changes made:" -ForegroundColor Yellow
Write-Host "   - lib/api.ts: API_BASE_URL = /api (Next.js API routes)" -ForegroundColor White
Write-Host "   - admin-panel/.env: VITE_API_BASE_URL = https://ofy-portfolio-h97t.vercel.app" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "   1. git add ." -ForegroundColor White
Write-Host "   2. git commit -m 'Switch to Vercel environment'" -ForegroundColor White
Write-Host "   3. git push" -ForegroundColor White
Write-Host "   4. Vercel Dashboard deploy" -ForegroundColor White
