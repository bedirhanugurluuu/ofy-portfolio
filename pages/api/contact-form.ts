import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  handleOptions,
  rateLimit,
  setCorsHeaders,
  verifyRecaptcha,
} from '../../lib/api-security';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = {
  name: 100,
  email: 254,
  phone: 30,
  message: 5000,
};

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
      key: 'contact-form',
      limit: 5,
      windowMs: 15 * 60 * 1000,
    })
  ) {
    return;
  }

  try {
    const { name, email, phone, message, recaptchaToken } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res
        .status(400)
        .json({ error: 'Name, email, and message are required' });
    }

    if (
      name.length > MAX_FIELD_LENGTH.name ||
      email.length > MAX_FIELD_LENGTH.email ||
      (phone && phone.length > MAX_FIELD_LENGTH.phone) ||
      message.length > MAX_FIELD_LENGTH.message
    ) {
      return res.status(400).json({ error: 'Input exceeds maximum length' });
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) {
      return res.status(403).json({ error: 'Security verification failed' });
    }

    const { error } = await supabase.from('contact_submissions').insert([
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        message: message.trim(),
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Error inserting contact form:', error);
      return res.status(500).json({ error: 'Failed to submit form' });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in contact-form API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
