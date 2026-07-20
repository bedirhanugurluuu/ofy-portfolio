import type { NextApiRequest, NextApiResponse } from 'next';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://farukyilmaz.com';

type RateLimitEntry = { count: number; resetAt: number };
const rateLimitStore = new Map<string, RateLimitEntry>();

export function getClientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

export function getAllowedOrigins(): string[] {
  const extra = (process.env.ADMIN_PANEL_ORIGINS || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);

  const defaults = [
    SITE_URL.replace(/\/$/, ''),
    'https://farukyilmaz.com',
    'https://www.farukyilmaz.com',
    'https://ofy-portfolio.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://ofy-admin.vercel.app',
    'https://ofy-admin-panel.vercel.app',
  ];

  return [...new Set([...defaults, ...extra])];
}

export function setCorsHeaders(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Max-Age', '86400');
}

export function handleOptions(req: NextApiRequest, res: NextApiResponse): boolean {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

export function rejectWriteMethods(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method || '')) {
    res.status(405).json({ error: 'Method not allowed' });
    return true;
  }
  return false;
}

/** Returns true when the request was handled (blocked or OPTIONS). */
export function handlePublicReadOnly(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  setCorsHeaders(req, res);
  if (handleOptions(req, res)) return true;
  if (rejectWriteMethods(req, res)) return true;
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return true;
  }
  return false;
}

export function rateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  options: { limit: number; windowMs: number; key?: string }
): boolean {
  const ip = getClientIp(req);
  const storeKey = `${options.key || 'default'}:${ip}`;
  const now = Date.now();
  let entry = rateLimitStore.get(storeKey);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + options.windowMs };
    rateLimitStore.set(storeKey, entry);
  }

  entry.count += 1;

  if (entry.count > options.limit) {
    res
      .status(429)
      .json({ error: 'Too many requests. Please try again later.' });
    return true;
  }

  return false;
}

export async function verifyRecaptcha(token?: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  // Keys not configured yet — don't block login; rate-limit/lockout still apply
  if (!secret) {
    console.warn(
      '[recaptcha] RECAPTCHA_SECRET_KEY is not set; skipping verification'
    );
    return true;
  }
  if (!token) return false;

  try {
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token }),
      }
    );
    const data = await response.json();
    return Boolean(data.success && (data.score ?? 0) >= 0.5);
  } catch {
    return false;
  }
}

export function verifyAdminSecret(req: NextApiRequest): boolean {
  const secret = process.env.ADMIN_API_SECRET;
  if (!secret) return false;
  const authHeader = req.headers.authorization;
  return authHeader === `Bearer ${secret}`;
}

export function getSiteUrl(): string {
  return SITE_URL.replace(/\/$/, '');
}
