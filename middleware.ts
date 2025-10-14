import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Admin paneli için her zaman izin verilen path'ler
const ADMIN_PATHS = ['/admin', '/temp-admin-panel']

// IP'leri cache'le (5 dakika)
let ipCache: { ips: string[], timestamp: number } = {
  ips: ['127.0.0.1'], // Default localhost
  timestamp: 0
}

async function getAllowedIPs(): Promise<string[]> {
  const now = Date.now()
  
  // Cache 5 dakika geçerli
  if (now - ipCache.timestamp < 5 * 60 * 1000) {
    return ipCache.ips
  }
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/ip-whitelist`)
    const data = await response.json()
    
    if (data.success) {
      const ips = data.data.map((item: any) => item.ip_address)
      ipCache = { ips, timestamp: now }
      return ips
    }
  } catch (error) {
    console.error('Error fetching allowed IPs:', error)
  }
  
  // Hata durumunda cache'deki IP'leri döndür
  return ipCache.ips
}

export async function middleware(request: NextRequest) {
  // GEÇİCİ OLARAK IP WHITELIST DEVRE DIŞI - SİTE HERKESE AÇIK
  // Tekrar aktif etmek için aşağıdaki yorum satırlarını kaldırın
  return NextResponse.next()
  
  /*
  const { pathname } = request.nextUrl
  
  // Admin paneli için IP kontrolü yapma
  if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // API routes için IP kontrolü yapma
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Client IP adresini al
  const clientIP = request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') || 
    '127.0.0.1'
  
  // Debug için IP'yi logla
  console.log('Client IP:', clientIP)
  console.log('Request headers:', Object.fromEntries(request.headers.entries()))
  
  // IP kontrolü
  const allowedIPs = await getAllowedIPs()
  console.log('Allowed IPs:', allowedIPs)
  
  const isAllowed = allowedIPs.includes(clientIP)
  console.log('Is allowed:', isAllowed)
  
  if (!isAllowed) {
    console.log('Redirecting to maintenance page')
    // Maintenance mode sayfasına yönlendir
    return NextResponse.rewrite(new URL('/maintenance', request.url))
  }
  
  return NextResponse.next()
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}
