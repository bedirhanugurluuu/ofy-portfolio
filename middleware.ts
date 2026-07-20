import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PATHS = ['/admin', '/temp-admin-panel'];

let ipCache: { ips: string[]; timestamp: number } = {
  ips: ['127.0.0.1'],
  timestamp: 0,
};

async function getAllowedIPs(): Promise<string[]> {
  const now = Date.now();

  if (now - ipCache.timestamp < 5 * 60 * 1000) {
    return ipCache.ips;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/ip-whitelist`
    );
    const data = await response.json();

    if (data.success) {
      const ips = data.data.map((item: { ip_address: string }) => item.ip_address);
      ipCache = { ips, timestamp: now };
      return ips;
    }
  } catch (error) {
    console.error('Error fetching allowed IPs:', error);
  }

  return ipCache.ips;
}

export async function middleware(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE !== 'true') {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;

  if (ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const rawIP = forwardedFor
    ? forwardedFor.split(',')[0].trim()
    : realIP || '127.0.0.1';
  const clientIP = rawIP;

  const localhostIPs = [
    '127.0.0.1',
    '::1',
    'localhost',
    '::ffff:127.0.0.1',
  ];
  const isLocalhost =
    localhostIPs.includes(clientIP) ||
    clientIP.startsWith('127.') ||
    clientIP.startsWith('::1');

  if (isLocalhost) {
    return NextResponse.next();
  }

  const allowedIPs = await getAllowedIPs();
  const isAllowed = allowedIPs.includes(clientIP);

  if (!isAllowed) {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
