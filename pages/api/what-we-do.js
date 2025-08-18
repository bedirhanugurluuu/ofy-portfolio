import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('what_we_do')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (!data) {
        return res.json({
          id: null,
          title: 'What We Do',
          subtitle: 'We create meaningful digital experiences that connect brands with their audiences.',
          service_1_title: 'Brand Strategy',
          service_1_items: 'Brand Audit\nResearch\nAudience\nCompetitive Analysis\nPositioning\nTone of Voice\nSocial Media',
          service_2_title: 'Digital Design',
          service_2_items: 'UI/UX Design\nWeb Design\nMobile Design\nBrand Identity\nVisual Design\nPrototyping\nUser Testing',
          service_3_title: 'Development',
          service_3_items: 'Frontend Development\nBackend Development\nMobile Apps\nE-commerce\nCMS Integration\nAPI Development\nPerformance Optimization'
        });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Error fetching what we do content:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        title,
        subtitle,
        service_1_title,
        service_1_items,
        service_2_title,
        service_2_items,
        service_3_title,
        service_3_items
      } = req.body;

      // Check if record exists
      const { data: existingData } = await supabase
        .from('what_we_do')
        .select('id')
        .limit(1)
        .single();
      
      if (!existingData) {
        // Insert new record
        const { error: insertError } = await supabase
          .from('what_we_do')
          .insert([{
            title,
            subtitle,
            service_1_title,
            service_1_items,
            service_2_title,
            service_2_items,
            service_3_title,
            service_3_items
          }]);
        
        if (insertError) throw insertError;
      } else {
        // Update existing record
        const { error: updateError } = await supabase
          .from('what_we_do')
          .update({
            title,
            subtitle,
            service_1_title,
            service_1_items,
            service_2_title,
            service_2_items,
            service_3_title,
            service_3_items,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
        
        if (updateError) throw updateError;
      }

      res.json({ message: 'What We Do content updated successfully' });
    } catch (error) {
      console.error('Error updating what we do content:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
