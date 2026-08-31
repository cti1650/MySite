import { applyPublicCors } from '@lib/cors';
import { buildContentsText } from '@lib/llmsContent';
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

  let content: string;
  try {
    content = await buildContentsText();
  } catch (e) {
    console.error('記事の取得失敗:', e);
    return res.status(500).send('コンテンツの取得中にエラーが発生しました。');
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Length', Buffer.byteLength(content, 'utf8'));
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=60',
  );
  res.status(200).send(content);
}
