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
    // News changes moderately, so medium cache
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800',
    'CDN-Cache-Control': 'public, max-age=300',
    'Vercel-CDN-Cache-Control': 'public, max-age=300',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return new Response(JSON.stringify(data || []), {
        status: 200,
        headers,
      });
    } catch (err) {
      console.error('News Edge Function Error:', err);
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
