import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, filename } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // Supabase URL'sini doğrula
    if (!url.includes('supabase.co')) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Video dosyasını fetch et
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VideoProxy/1.0)',
        'Accept': 'video/mp4,video/webm,video/quicktime,*/*',
        'Range': req.headers.range || 'bytes=0-',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch video' });
    }

    // Content-Type'ı ayarla
    const contentType = response.headers.get('content-type') || 'video/mp4';
    res.setHeader('Content-Type', contentType);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');

    // Cache headers
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('ETag', response.headers.get('etag') || `"${Date.now()}"`);

    // Range request desteği
    if (response.headers.get('content-range')) {
      res.setHeader('Content-Range', response.headers.get('content-range')!);
      res.status(206);
    }

    if (response.headers.get('content-length')) {
      res.setHeader('Content-Length', response.headers.get('content-length')!);
    }

    // Video dosyasını stream et
    if (response.body) {
      response.body.pipe(res);
    } else {
      res.status(500).json({ error: 'No response body' });
    }

  } catch (error) {
    console.error('Video proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
