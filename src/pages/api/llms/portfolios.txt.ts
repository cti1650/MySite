import { fetchPortfolios } from '@lib/portfolioApi';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const portfolios = await fetchPortfolios();
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
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.status(200).send(content);
}
