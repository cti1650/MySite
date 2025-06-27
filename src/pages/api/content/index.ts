import { fetchContent } from '@lib/contentApi';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ContentResponse } from 'src/types/posts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContentResponse>
) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const contentRes = await fetchContent();

    if ('error' in contentRes) {
      throw new Error(contentRes.error);
    }

    res.status(200).json(contentRes);
  } catch (e: any) {
    res.status(500).json({ error: e.message, qiitaPosts: [], zennPosts: [] });
  }
}
