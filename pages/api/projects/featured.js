import { createClient } from '@supabase/supabase-js';
import { handlePublicReadOnly } from '../../../lib/api-security';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (handlePublicReadOnly(req, res)) return;

  try {
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
