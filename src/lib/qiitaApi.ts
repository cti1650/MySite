import axios from 'axios';
import type { PostResponse } from 'src/types/posts';

export async function fetchQiita(): Promise<PostResponse> {
  const token = process.env.QIITA_ACCESS_TOKEN;
  if (!token) {
    return {
      error: 'Qiitaのアクセストークンが未設定です',
      code: 400,
      items: [],
    };
  }

  try {
    const response = await axios.get(
      'https://qiita.com/api/v2/authenticated_user/items',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.data;
    return { items: data };
  } catch (e: any) {
    return { code: 500, error: e.message, items: [] };
  }
}
