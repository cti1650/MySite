import type { NextApiRequest, NextApiResponse } from 'next';
import { Post } from 'src/types/posts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[] | { error: string }>
) {
  if (req.method !== 'GET') return res.status(405).end();

  const token = process.env.QIITA_ACCESS_TOKEN;
  if (!token) {
    return res
      .status(400)
      .json({ error: 'Qiitaのアクセストークンが未設定です' });
  }

  try {
    const response = await fetch(
      'https://qiita.com/api/v2/authenticated_user/items',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
