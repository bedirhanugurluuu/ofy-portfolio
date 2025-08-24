import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Hardcode Supabase credentials for now
const supabaseUrl = 'https://lsxafginsylkeuyzuiau.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeGFmZ2luc3lsa2V1eXp1aWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzQsImV4cCI6MjA1MDU0ODk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing subscriber:', checkError);
      return res.status(500).json({ 
        message: 'Database error', 
        error: checkError.message,
        code: checkError.code 
      });
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
        error: error.message,
        code: error.code
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
