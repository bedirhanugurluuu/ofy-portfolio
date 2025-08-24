import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Basic validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingSubscriber) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    // Insert new subscriber
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
      return res.status(500).json({ message: 'Failed to subscribe' });
    }

    // Optional: Send welcome email or integrate with email service
    // For now, just return success

    return res.status(200).json({ 
      message: 'Successfully subscribed to newsletter',
      data 
    });

  } catch (error) {
    console.error('Newsletter API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
