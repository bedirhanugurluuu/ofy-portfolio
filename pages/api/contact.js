import { createClient } from '@supabase/supabase-js';
import { handlePublicReadOnly } from '../../lib/api-security';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const defaultContent = {
  id: null,
  title: "Let's connect and bring your ideas to life",
  phone: '',
  email: '',
  instagram: '',
  linkedin: '',
  address_line1: '',
  address_line2: '',
  studio_hours_weekdays: '',
  studio_hours_weekend: '',
  image_path: null,
};

export default async function handler(req, res) {
  if (handlePublicReadOnly(req, res)) return;

  try {
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    const { data, error } = await supabase
      .from('contact')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json(data || defaultContent);
  } catch (error) {
    console.error('Error fetching contact content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
