import type { NextApiRequest, NextApiResponse } from 'next';
import { Post } from 'src/types/posts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    { qiitaPosts: Post[]; zennPosts: Post[] } | { error: string }
  >
) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;
    const [qiitaRes, zennRes] = await Promise.all([
      fetch(`${baseUrl}/api/content/qiita`).then((res) => res.json()),
      fetch(`${baseUrl}/api/content/zenn`).then((res) => res.json()),
    ]);

    if ('error' in qiitaRes || 'error' in zennRes) {
      throw new Error(qiitaRes.error || zennRes.error);
    }

    res.status(200).json({ qiitaPosts: qiitaRes, zennPosts: zennRes });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
