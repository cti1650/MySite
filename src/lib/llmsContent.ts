import type { Post } from 'src/types/posts';
import { getContent } from './contentApi';
import { getPortfolios } from './portfolioApi';

/**
 * llms.txt 系エンドポイントの本文生成。
 *
 * 以前は各ルートが `${protocol}://${req.headers.host}` に対して自分自身を
 * HTTP fetchしていたが、Hostヘッダ経由のSSRF・キャッシュ汚染の起点になるため
 * データ取得関数を直接呼ぶ形に統一している。
 * 取得のキャッシュは src/lib/cache.ts の共通実装をページ側と共有する。
 */

/** 外部データ由来の文字列が行構造を壊さないよう改行を潰す */
const flatten = (value: unknown): string =>
  String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim();

export const buildIndexText = (baseUrl: string): string => {
  const lastUpdated = new Date().toLocaleDateString('sv-SE', {
    timeZone: 'Asia/Tokyo',
  });

  return `# cti1650 Portfolio

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
};

export const buildPortfoliosText = async (): Promise<string> => {
  const items = (await getPortfolios())
    .map((portfolio) =>
      [
        '<PortfolioItem>',
        `Name: ${flatten(portfolio.name)}`,
        `Description: ${flatten(portfolio.description)}`,
        `Link: ${flatten(portfolio.link)}`,
        `GitHub: ${flatten(portfolio.github)}`,
        `Image: ${flatten(portfolio.img)}`,
        `Tags: ${(portfolio.tags ?? []).map(flatten).join(', ')}`,
        `Type: ${flatten(portfolio.type)}`,
        '</PortfolioItem>',
        '',
      ].join('\n'),
    )
    .join('');

  return `<PortfolioItems>\n${items}</PortfolioItems>`;
};

const formatPosts = (posts: Post[], source: string): string =>
  posts
    .map((post) =>
      [
        '<ContentItem>',
        `Title: ${flatten(post.title)}`,
        `URL: ${flatten(post.url)}`,
        `Likes: ${flatten(post.likes_count)}`,
        `Source: ${source}`,
        `PublishedAt: ${flatten(post.created_at)}`,
        `UpdatedAt: ${flatten(post.updated_at)}`,
        '</ContentItem>',
        '',
      ].join('\n'),
    )
    .join('');

export const buildContentsText = async (): Promise<string> => {
  const { qiitaPosts, zennPosts, error } = await getContent();
  if (error) {
    throw new Error(error);
  }

  return `<Contents>\n${formatPosts(qiitaPosts, 'Qiita')}${formatPosts(
    zennPosts,
    'Zenn',
  )}</Contents>`;
};
