import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    const [indexRes, portfoliosRes, contentsRes] = await Promise.all([
      fetch(`${baseUrl}/api/llms/index.txt`).then((r) => r.text()),
      fetch(`${baseUrl}/api/llms/portfolios.txt`).then((r) => r.text()),
      fetch(`${baseUrl}/api/llms/contents.txt`).then((r) => r.text()),
    ]);

    const content = `${indexRes}

# ポートフォリオ一覧
${portfoliosRes}

# 記事一覧
${contentsRes}`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Length', Buffer.byteLength(content, 'utf8'));
    res.setHeader(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=60',
    );
    res.status(200).send(content);
  } catch (e) {
    console.error('llms-full.txt の生成失敗:', e);
    res.status(500).send('全文の取得中にエラーが発生しました。');
  }
}
