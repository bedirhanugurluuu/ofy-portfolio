import { supabase } from '../../lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  handleOptions,
  rateLimit,
  setCorsHeaders,
  verifyRecaptcha,
} from '../../lib/api-security';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setCorsHeaders(req, res);
  if (handleOptions(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (
    rateLimit(req, res, {
      key: 'newsletter',
      limit: 3,
      windowMs: 15 * 60 * 1000,
    })
  ) {
    return;
  }

  try {
    const { email, recaptchaToken } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) {
      return res.status(403).json({ message: 'Security verification failed' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existingSubscriber) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    const { error } = await supabase.from('newsletter_subscribers').insert([
      {
        email: normalizedEmail,
        subscribed_at: new Date().toISOString(),
        status: 'active',
      },
    ]);

    if (error) {
      console.error('Newsletter subscription error:', error);
      return res.status(500).json({ message: 'Failed to subscribe' });
    }

    return res
      .status(200)
      .json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
