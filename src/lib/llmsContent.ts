import type { Post } from 'src/types/posts';
import { fetchContent } from './contentApi';
import { fetchPortfolios, type ResponseData } from './portfolioApi';

/**
 * llms.txt 系エンドポイントの本文生成。
 *
 * 以前は各ルートが `${protocol}://${req.headers.host}` に対して自分自身を
 * HTTP fetchしていたが、Hostヘッダ経由のSSRF・キャッシュ汚染の起点になるため
 * データ取得関数を直接呼ぶ形に統一している。
 */

const CACHE_TTL_MS = 3600 * 1000;

type Cache<T> = { value: T; fetchedAt: number } | null;

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

let portfoliosCache: Cache<ResponseData> = null;

export const buildPortfoliosText = async (): Promise<string> => {
  const now = Date.now();
  if (!portfoliosCache || now - portfoliosCache.fetchedAt > CACHE_TTL_MS) {
    portfoliosCache = { value: await fetchPortfolios(), fetchedAt: now };
  }

  const items = portfoliosCache.value
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

type CachedContents = { qiitaPosts: Post[]; zennPosts: Post[] };

let contentsCache: Cache<CachedContents> = null;

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
  const now = Date.now();
  if (!contentsCache || now - contentsCache.fetchedAt > CACHE_TTL_MS) {
    const contentRes = await fetchContent();
    if (contentRes.error) {
      throw new Error(contentRes.error);
    }
    contentsCache = {
      value: {
        qiitaPosts: contentRes.qiitaPosts,
        zennPosts: contentRes.zennPosts,
      },
      fetchedAt: now,
    };
  }

  const { qiitaPosts, zennPosts } = contentsCache.value;
  return `<Contents>\n${formatPosts(qiitaPosts, 'Qiita')}${formatPosts(
    zennPosts,
    'Zenn',
  )}</Contents>`;
};
