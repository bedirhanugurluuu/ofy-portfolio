# Local Development Environment Switch Script
Write-Host "Switching to LOCAL development environment..." -ForegroundColor Green

# Ana proje - lib/api.ts
$apiContent = @"
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

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
  const res = await axios.get<Project[]>(`${API_BASE_URL}/api/projects`);
  return res.data;
}

export async function fetchProjectBySlug(slug: string): Promise<Project> {
  const res = await axios.get<Project>(`${API_BASE_URL}/api/projects/${slug}`);
  return res.data;
}

export async function fetchIntroBanners(): Promise<IntroBanner[]> {
  const res = await axios.get<IntroBanner[]>(`${API_BASE_URL}/api/intro-banners`);
  return res.data;
}

export async function fetchAbout(): Promise<AboutContent> {
  const res = await axios.get<AboutContent>(`${API_BASE_URL}/api/about`);
  return res.data;
}

export async function fetchNews(): Promise<News[]> {
  const res = await axios.get<News[]>(`${API_BASE_URL}/api/news`);
  return res.data;
}

export async function fetchFeaturedNews(): Promise<News[]> {
  const res = await axios.get<News[]>(`${API_BASE_URL}/api/news/featured`);
  return res.data;
}

export async function fetchNewsBySlug(slug: string): Promise<News> {
  const res = await axios.get<News>(`${API_BASE_URL}/api/news/slug/${slug}`);
  return res.data;
}

export async function fetchAboutGallery(): Promise<AboutGalleryImage[]> {
  const res = await axios.get<AboutGalleryImage[]>(`${API_BASE_URL}/api/about-gallery`);
  return res.data;
}

export async function fetchAwards(): Promise<Award[]> {
  const res = await axios.get<Award[]>(`${API_BASE_URL}/api/awards`);
  return res.data;
}

export async function fetchSlider(): Promise<SliderItem[]> {
  const res = await axios.get<SliderItem[]>(`${API_BASE_URL}/api/slider`);
  return res.data;
}

export async function fetchWhatWeDo(): Promise<WhatWeDoContent> {
  const res = await axios.get<WhatWeDoContent>(`${API_BASE_URL}/api/what-we-do`);
  return res.data;
}

export async function fetchContact(): Promise<ContactContent> {
  const res = await axios.get<ContactContent>(`${API_BASE_URL}/api/contact`);
  return res.data;
}
"@

# Ana proje - lib/api.ts'yi güncelle
$apiContent | Out-File -FilePath "lib/api.ts" -Encoding UTF8

# Admin panel - .env
$adminEnvContent = @"
VITE_API_BASE_URL=http://localhost:5000
"@

# Admin panel - .env'yi güncelle
$adminEnvContent | Out-File -FilePath "admin-panel/.env" -Encoding UTF8

Write-Host "Switched to LOCAL environment!" -ForegroundColor Green
Write-Host "Changes made:" -ForegroundColor Yellow
Write-Host "   - lib/api.ts: API_BASE_URL = http://localhost:5000" -ForegroundColor White
Write-Host "   - admin-panel/.env: VITE_API_BASE_URL = http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "   1. Backend: npm start (port 5000)" -ForegroundColor White
Write-Host "   2. Ana proje: npm run dev (port 3000/3001)" -ForegroundColor White
Write-Host "   3. Admin panel: npm run dev (port 3002)" -ForegroundColor White
