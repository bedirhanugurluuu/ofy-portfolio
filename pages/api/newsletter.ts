import { supabase } from '../../lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    console.log('Newsletter API called with email:', email);

    // Basic validation
    if (!email || !email.includes('@')) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // For now, just return success without database operations
    console.log('Newsletter subscription successful (test mode)');

    return res.status(200).json({ 
      message: 'Successfully subscribed to newsletter (test mode)',
      email: email.toLowerCase()
    });

  } catch (error) {
    console.error('Newsletter API error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
