import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
    // Intro banners change very rarely, so very long cache
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    'CDN-Cache-Control': 'public, max-age=3600',
    'Vercel-CDN-Cache-Control': 'public, max-age=3600',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('intro_banners')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      
      return new Response(JSON.stringify(data || []), {
        status: 200,
        headers,
      });
    } catch (err) {
      console.error('Intro Banners Edge Function Error:', err);
      return new Response(
        JSON.stringify({ error: "Sunucu hatası" }), 
        { status: 500, headers }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }), 
    { status: 405, headers }
  );
}
