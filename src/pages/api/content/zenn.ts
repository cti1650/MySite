import { fetchZenn } from '@lib/zennApi';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Post, PostResponse } from 'src/types/posts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[] | { error: string }>
) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const data: PostResponse = await fetchZenn();
    if (data && data.code && data.code !== 200) {
      return res
        .status(data.code || 500)
        .json({ error: data.error || 'Zennのデータ取得に失敗しました' });
    }

    res.status(200).json(data.items || []);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
