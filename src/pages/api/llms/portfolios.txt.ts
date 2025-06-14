import { fetchPortfolios } from '@lib/portfolioApi';
import type { NextApiRequest, NextApiResponse } from 'next';

let cachedPortfolios: any[] | null = null;
let lastFetched = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const now = Date.now();
  if (!cachedPortfolios || now - lastFetched > 3600 * 1000) {
    cachedPortfolios = await fetchPortfolios();
    lastFetched = now;
  }

  const portfolios = cachedPortfolios;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  let content = '<PortfolioItems>\n';
  portfolios.forEach((portfolio) => {
    let item = '<PortfolioItem>\n';
    item += `Name: ${portfolio.name}\n`;
    item += `Description: ${portfolio.description}\n`;
    item += `Link: ${portfolio.link}\n`;
    item += `GitHub: ${portfolio.github}\n`;
    item += `Image: ${portfolio.img}\n`;
    item += `Tags: ${portfolio.tags.join(', ')}\n`;
    item += `Type: ${portfolio.type}\n`;
    item += '</PortfolioItem>\n';
    content += item;
  });
  content += '</PortfolioItems>';

  res.setHeader('Content-Length', Buffer.byteLength(content, 'utf8'));
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=60'
  );
  res.status(200).send(content);
}
