import { NextApiRequest, NextApiResponse } from 'next';
import { fetchProjects, fetchNews } from '@/lib/api';

const SITE_URL = 'https://farukyilmaz.com';

function generateSiteMap(pages: string[], projects: any[], news: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Static pages -->
     ${pages
       .map((page) => {
         return `
       <url>
           <loc>${`${SITE_URL}${page}`}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
     
     <!-- Project pages -->
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
     
     <!-- News pages -->
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
  try {
    // Fetch dynamic data
    const [projects, news] = await Promise.all([
      fetchProjects(),
      fetchNews()
    ]);

    // Static pages
    const pages = [
      '',
      '/about',
      '/projects',
      '/blog',
      '/contact'
    ];

    // Generate the XML sitemap
    const sitemap = generateSiteMap(pages, projects, news);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    
    // Fallback sitemap with static pages only
    const pages = ['', '/about', '/projects', '/blog', '/contact'];
    const sitemap = generateSiteMap(pages, [], []);
    
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();
  }
}
