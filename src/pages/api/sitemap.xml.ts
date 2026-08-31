import { resolveBaseUrl } from '@lib/siteUrl';
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

const escapeXml = (value: string): string =>
  value.replace(
    /[<>&'"]/g,
    (char) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
      })[char] as string,
  );

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  // アクセスされたドメインが許可済みならそれを、未知のホストならカノニカルURLを使う
  const baseUrl = escapeXml(resolveBaseUrl(req.headers));
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
