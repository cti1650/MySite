import type { NextApiRequest, NextApiResponse } from 'next';
import { Post } from 'src/types/posts';

let cachedContents: { qiitaPosts: Post[]; zennPosts: Post[] } | null = null;
let lastFetched = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const now = Date.now();
  if (!cachedContents || now - lastFetched > 3600 * 1000) {
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

      cachedContents = {
        qiitaPosts: qiitaRes,
        zennPosts: zennRes,
      };
      lastFetched = now;
    } catch (e) {
      console.error('記事の取得失敗:', e);
      return res.status(500).send('コンテンツの取得中にエラーが発生しました。');
    }
  }

  const { qiitaPosts, zennPosts } = cachedContents!;
  let content = '<Contents>\n';

  const formatPosts = (posts: Post[], source: string) => {
    return posts
      .map((post) => {
        return (
          '<ContentItem>\n' +
          `Title: ${post.title}\n` +
          `URL: ${post.url}\n` +
          `Likes: ${post.likes_count}\n` +
          `Source: ${source}\n` +
          `PublishedAt: ${post.created_at}\n` +
          `UpdatedAt: ${post.updated_at}\n` +
          '</ContentItem>\n'
        );
      })
      .join('');
  };

  content += formatPosts(qiitaPosts, 'Qiita');
  content += formatPosts(zennPosts, 'Zenn');
  content += '</Contents>';

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Length', Buffer.byteLength(content, 'utf8'));
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=60'
  );
  res.status(200).send(content);
}
