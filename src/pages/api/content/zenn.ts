import type { NextApiRequest, NextApiResponse } from 'next';
import { Post } from 'src/types/posts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[] | { error: string }>
) {
  if (req.method !== 'GET') return res.status(405).end();

  const username = process.env.YOUR_ZENN_USERNAME;
  if (!username) {
    return res.status(400).json({ error: 'Zennのユーザー名が未設定です' });
  }

  try {
    const response = await fetch(
      `https://zenn.dev/api/articles?username=${username}`
    );
    const data = await response.json();

    const articles: Post[] = data.articles.map((item: any) => ({
      ...item,
      likes_count: item.liked_count || 0,
      created_at: item.published_at || item.created_at,
      updated_at: item.body_updated_at || item.updated_at,
      url: `https://zenn.dev/${username}/articles/${item.slug}`,
    }));

    res.status(200).json(articles);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
