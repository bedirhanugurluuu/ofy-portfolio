import { NextApiRequest, NextApiResponse } from 'next';
import { fetchProjects, fetchNews } from '@/lib/api';
import { SITE_URL } from '@/lib/site-config';

function generateSiteMap(pages: string[], projects: any[], news: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map((page) => {
         return `
       <url>
           <loc>${`${SITE_URL}${page}`}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>${page === '' ? '1.0' : '0.8'}</priority>
       </url>
     `;
       })
       .join('')}
     ${projects
       .map((project) => {
         return `
       <url>
           <loc>${`${SITE_URL}/projects/${project.slug}`}</loc>
           <lastmod>${project.updated_at}</lastmod>
           <changefreq>monthly</changefreq>
           <priority>0.7</priority>
       </url>
     `;
       })
       .join('')}
     ${news
       .map((article) => {
         return `
       <url>
           <loc>${`${SITE_URL}/blog/${article.slug}`}</loc>
           <lastmod>${article.updated_at}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.6</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const staticPages = ['', '/about', '/projects', '/blog', '/contact', '/gallery'];

  try {
    const [projects, news] = await Promise.all([
      fetchProjects(),
      fetchNews(),
    ]);

    const sitemap = generateSiteMap(staticPages, projects, news);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate'
    );
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);

    const sitemap = generateSiteMap(staticPages, [], []);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate'
    );
    res.write(sitemap);
    res.end();
  }
}
