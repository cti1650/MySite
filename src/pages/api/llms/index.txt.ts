import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  const lastUpdated = new Date().toLocaleDateString('sv-SE', {
    timeZone: 'Asia/Tokyo',
  });
  const content = `# cti1650 Portfolio

> Yuichi Sakagami (cti1650) のポートフォリオサイト。個人開発したChrome拡張機能・Webアプリ・ツール類と、Qiita/Zennで公開している技術記事をまとめています。

Last-Updated: ${lastUpdated}

## プロフィール
- Name: Yuichi Sakagami
- Handle: cti1650
- Birthday: 1992-01-25
- Skillset: HTML, JavaScript, TypeScript, CSS, React.js, Next.js, Tailwind CSS, React Native, Expo, Python, PHP, VBA, GAS, Chrome拡張機能開発
- Qualifications & Tools: ITパスポート, VBA Expert Standard(Excel), GitHub, VSCode

## リンク
- [Site](${baseUrl}/): ポートフォリオサイト本体
- [GitHub](https://github.com/cti1650)
- [X (Twitter)](https://x.com/cti1650)
- [Qiita](https://qiita.com/cti1650)
- [Zenn](https://zenn.dev/cti1650)

## 参照先
- [ポートフォリオ一覧](${baseUrl}/llms/portfolios.txt): 公開中の個人開発プロジェクト一覧(技術スタック・リンク付き)
- [記事一覧](${baseUrl}/llms/contents.txt): Qiita/Zennで公開している技術記事一覧(公開日・いいね数付き)
- [全文まとめ](${baseUrl}/llms-full.txt): 上記すべてを1ファイルに連結したもの`;
  res.setHeader('Content-Length', Buffer.byteLength(content, 'utf8'));
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=60',
  ); // Cache for 1 hour
  res.status(200).send(content);
}
