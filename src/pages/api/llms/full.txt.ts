import { applyPublicCors } from '@lib/cors';
import {
  buildContentsText,
  buildIndexText,
  buildPortfoliosText,
} from '@lib/llmsContent';
import { resolveBaseUrl } from '@lib/siteUrl';
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

  try {
    const [portfoliosText, contentsText] = await Promise.all([
      buildPortfoliosText(),
      buildContentsText(),
    ]);

    const content = `${buildIndexText(resolveBaseUrl(req.headers))}

# ポートフォリオ一覧
${portfoliosText}

# 記事一覧
${contentsText}`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Length', Buffer.byteLength(content, 'utf8'));
    res.setHeader(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=60',
    );
    res.status(200).send(content);
  } catch (e) {
    console.error('llms-full.txt の生成失敗:', e);
    res.status(500).send('全文の取得中にエラーが発生しました。');
  }
}
