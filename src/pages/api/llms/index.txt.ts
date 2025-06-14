import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  let content = `# このサイトについて
このサイトは、私のポートフォリオを紹介するためのものです。以下に、私のスキルセットやプロジェクトについての情報を記載しています。

# 参照先
- [ポートフォリオ一覧](${baseUrl}/llms/portfolios.txt)
- [記事一覧](${baseUrl}/llms/contents.txt)`;
  res.setHeader('Content-Length', Buffer.byteLength(content, 'utf8'));
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=60'
  ); // Cache for 1 hour
  res.status(200).send(content);
}
