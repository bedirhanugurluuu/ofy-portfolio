import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: [
      "localhost", 
      "lsxafginsylkeuyzuiau.supabase.co", // Supabase Storage domain
      "your-vercel-domain.vercel.app" // Production domain
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
}

export default nextConfig
