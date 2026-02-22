import { fetchQiita } from '@lib/qiitaApi';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Post, PostResponse } from 'src/types/posts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[] | { error: string }>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const data: PostResponse = await fetchQiita();
    if (data?.code && data.code !== 200) {
      return res
        .status(data.code || 500)
        .json({ error: data.error || 'Qiitaのデータ取得に失敗しました' });
    }
    res.status(200).json(data.items || []);
  } catch (_e: unknown) {
    res
      .status(500)
      .json({ error: 'Qiitaのデータ取得中にエラーが発生しました' });
  }
}
