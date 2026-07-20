import type { NextApiRequest, NextApiResponse } from 'next';
import {
  getClientIp,
  handleOptions,
  rateLimit,
  setCorsHeaders,
  verifyRecaptcha,
} from '../../lib/api-security';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

type LockEntry = {
  failures: number;
  lockedUntil: number;
  windowStart: number;
};

const loginLockStore = new Map<string, LockEntry>();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function storeKey(email: string, ip: string): string {
  return `${normalizeEmail(email)}:${ip}`;
}

function getEntry(key: string): LockEntry {
  const now = Date.now();
  let entry = loginLockStore.get(key);

  if (!entry || now - entry.windowStart > LOCKOUT_MS) {
    entry = { failures: 0, lockedUntil: 0, windowStart: now };
    loginLockStore.set(key, entry);
  }

  return entry;
}

function remainingAttempts(entry: LockEntry): number {
  return Math.max(0, MAX_ATTEMPTS - entry.failures);
}

function lockPayload(entry: LockEntry) {
  const now = Date.now();
  const locked = entry.lockedUntil > now;
  return {
    allowed: !locked,
    remainingAttempts: remainingAttempts(entry),
    lockedUntil: locked ? entry.lockedUntil : null,
    retryAfterSeconds: locked
      ? Math.ceil((entry.lockedUntil - now) / 1000)
      : 0,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setCorsHeaders(req, res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (
    rateLimit(req, res, {
      key: 'admin-login-guard',
      limit: 30,
      windowMs: 15 * 60 * 1000,
    })
  ) {
    return;
  }

  const { action, email, recaptchaToken } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!['attempt', 'failure', 'success'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  const ip = getClientIp(req);
  const key = storeKey(email, ip);
  const entry = getEntry(key);
  const now = Date.now();

  if (entry.lockedUntil > now) {
    return res.status(429).json({
      ...lockPayload(entry),
      error: 'Too many failed login attempts. Please try again later.',
    });
  }

  if (action === 'attempt') {
    const valid = await verifyRecaptcha(recaptchaToken);
    if (!valid) {
      return res.status(403).json({
        allowed: false,
        error: 'Security verification failed',
        remainingAttempts: remainingAttempts(entry),
      });
    }

    return res.status(200).json(lockPayload(entry));
  }

  if (action === 'failure') {
    entry.failures += 1;

    if (entry.failures >= MAX_ATTEMPTS) {
      entry.lockedUntil = now + LOCKOUT_MS;
    }

    loginLockStore.set(key, entry);

    const payload = lockPayload(entry);
    return res.status(payload.allowed ? 200 : 429).json({
      ...payload,
      error: payload.allowed
        ? undefined
        : 'Account temporarily locked due to too many failed attempts.',
    });
  }

  // success — clear lockout for this email+ip
  loginLockStore.delete(key);
  return res.status(200).json({ allowed: true, remainingAttempts: MAX_ATTEMPTS });
}
