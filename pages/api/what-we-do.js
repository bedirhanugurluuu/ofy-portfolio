import { createClient } from '@supabase/supabase-js';
import { handlePublicReadOnly } from '../../lib/api-security';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const defaultContent = {
  id: null,
  title: 'What We Do',
  subtitle:
    'We create meaningful digital experiences that connect brands with their audiences.',
  service_1_title: 'Brand Strategy',
  service_1_items:
    'Brand Audit\nResearch\nAudience\nCompetitive Analysis\nPositioning\nTone of Voice\nSocial Media',
  service_2_title: 'Digital Design',
  service_2_items:
    'UI/UX Design\nWeb Design\nMobile Design\nBrand Identity\nVisual Design\nPrototyping\nUser Testing',
  service_3_title: 'Development',
  service_3_items:
    'Frontend Development\nBackend Development\nMobile Apps\nE-commerce\nCMS Integration\nAPI Development\nPerformance Optimization',
};

export default async function handler(req, res) {
  if (handlePublicReadOnly(req, res)) return;

  try {
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    const { data, error } = await supabase
      .from('what_we_do')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json(data || defaultContent);
  } catch (error) {
    console.error('Error fetching what we do content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
