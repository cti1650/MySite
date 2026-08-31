import { applyCors } from '@lib/cors';
import { fetchZenn } from '@lib/zennApi';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Post, PostResponse } from 'src/types/posts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[] | { error: string }>,
) {
  if (applyCors(req, res, { methods: ['GET'] })) return;
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).end();
  }

  try {
    const data: PostResponse = await fetchZenn();
    if (data?.code && data.code !== 200) {
      return res
        .status(data.code || 500)
        .json({ error: 'Zennのデータ取得に失敗しました' });
    }

    res.status(200).json(data.items || []);
  } catch (_e: unknown) {
    res.status(500).json({ error: 'Zennのデータ取得中にエラーが発生しました' });
  }
}
