import { fetchContent } from '@lib/contentApi';
import { applyCors } from '@lib/cors';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ContentResponse } from 'src/types/posts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContentResponse>,
) {
  if (applyCors(req, res, { methods: ['GET'] })) return;
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).end();
  }

  try {
    const contentRes = await fetchContent();

    if ('error' in contentRes) {
      throw new Error(contentRes.error);
    }

    res.status(200).json(contentRes);
  } catch (_e: unknown) {
    res.status(500).json({
      error: 'コンテンツの取得中にエラーが発生しました',
      qiitaPosts: [],
      zennPosts: [],
    });
  }
}
