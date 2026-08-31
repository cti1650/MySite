import { buildCacheControl } from '@lib/cache';
import { applyPublicCors } from '@lib/cors';
import { buildPortfoliosText } from '@lib/llmsContent';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (applyPublicCors(req, res)) return;
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).end();
  }

  const content = await buildPortfoliosText();

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Length', Buffer.byteLength(content, 'utf8'));
  res.setHeader('Cache-Control', buildCacheControl(3600));
  res.status(200).send(content);
}
