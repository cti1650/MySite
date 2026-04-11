import type { NextApiRequest, NextApiResponse } from 'next';

const STATIC_PATHS = [
  '/',
  '/content',
  '/contact',
  '/site',
  '/privacy_policy',
  '/terms_of_service',
];

const LLMS_PATHS = [
  '/llms.txt',
  '/llms-full.txt',
  '/llms/portfolios.txt',
  '/llms/contents.txt',
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
  const lastmod = new Date().toISOString();

  const urls = [...STATIC_PATHS, ...LLMS_PATHS]
    .map((path) => {
      const priority = path === '/' ? '1.0' : '0.7';
      return `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=60',
  );
  res.status(200).send(xml);
}
