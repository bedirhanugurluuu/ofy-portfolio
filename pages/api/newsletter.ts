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

    // Check if email already exists
    console.log('Checking for existing subscriber...');
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing subscriber:', checkError);
      return res.status(500).json({ message: 'Database error' });
    }

    if (existingSubscriber) {
      console.log('Email already subscribed:', email);
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    // Insert new subscriber
    console.log('Inserting new subscriber...');
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: email.toLowerCase(),
          subscribed_at: new Date().toISOString(),
          status: 'active'
        }
      ])
      .select();

    if (error) {
      console.error('Newsletter subscription error:', error);
      return res.status(500).json({ 
        message: 'Failed to subscribe',
        error: error.message 
      });
    }

    console.log('Successfully subscribed:', data);

    return res.status(200).json({ 
      message: 'Successfully subscribed to newsletter',
      data 
    });

  } catch (error) {
    console.error('Newsletter API error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
