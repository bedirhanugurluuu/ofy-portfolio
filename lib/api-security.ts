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

export function setCorsHeaders(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin;
  const allowedOrigins = [
    SITE_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
}

export function handleOptions(req: NextApiRequest, res: NextApiResponse): boolean {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
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
  if (!secret) {
    return process.env.NODE_ENV !== 'production';
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
