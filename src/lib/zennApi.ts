import axios from 'axios';
import type { Post, PostResponse } from 'src/types/posts';

export async function fetchZenn(): Promise<PostResponse> {
  const username = process.env.YOUR_ZENN_USERNAME;
  if (!username) {
    return { error: 'Zennのユーザー名が未設定です', code: 400, items: [] };
  }

  try {
    const response = await axios.get(
      `https://zenn.dev/api/articles?username=${username}`,
    );
    const data = await response.data;

    const articles: Post[] = data.articles.map(
      (item: Record<string, unknown>) => ({
        ...item,
        likes_count: item.liked_count || 0,
        created_at: item.published_at || item.created_at,
        updated_at: item.body_updated_at || item.updated_at,
        url: `https://zenn.dev/${username}/articles/${item.slug}`,
      }),
    );
    return { items: articles };
  } catch (e: unknown) {
    return {
      code: 500,
      error: e instanceof Error ? e.message : 'Unknown error',
      items: [],
    };
  }
}
