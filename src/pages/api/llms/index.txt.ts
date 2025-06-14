import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  console.log('test', req);
  let content = `# このサイトについて
このサイトは、私のポートフォリオを紹介するためのものです。以下に、私のスキルセットやプロジェクトについての情報を記載しています。

# 参照先
- [Portfolio](${req.headers.host}/api/llms/portfolios.txt)`;
  res.setHeader('Content-Length', Buffer.byteLength(content, 'utf8'));
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.status(200).send(content);
}
