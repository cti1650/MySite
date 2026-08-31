import type { GetServerSideProps } from 'next';
import { buildCacheControl } from './cache';
import { getContent } from './contentApi';
import { getPortfolios } from './portfolioApi';
import { CANONICAL_SITE_URL, resolveBaseUrl } from './siteUrl';

/**
 * 全ページ共通のメタ情報。
 *
 * og:url はビルド時に焼き込むとアクセス先ドメインを反映できず、
 * OGPクローラーはJSを実行しないためクライアント側での書き換えも効かない。
 * そのためリクエストのHostとパスからサーバ側で組み立てる。
 */
export type SiteMetaProps = {
  /** アクセスされたドメインを基点とした現在ページの絶対URL（og:url用） */
  pageUrl: string;
  /** カノニカルドメインを基点とした現在ページの絶対URL（rel=canonical用） */
  canonicalUrl: string;
  /** アクセスされたドメインのorigin（画像等の絶対URL組み立て用） */
  origin: string;
};

type CreatePagePropsOptions<T> = {
  /**
   * 許可するレイヤー。指定した場合、params.layer がこの中になければ404を返す。
   * SSG時の `fallback: false` が担っていた絞り込みの代替。
   */
  layers?: readonly string[];
  /** ページ固有のデータ取得 */
  fetchProps?: () => Promise<T>;
  /** VercelのCDNキャッシュ秒数（SSGの revalidate 相当） */
  sMaxAge?: number;
};

/**
 * ページ共通の getServerSideProps を生成する。
 * CDNキャッシュ(s-maxage)をホスト+パス単位で効かせるため、
 * SSG/ISRから移行しても実効的な配信コストはほぼ変わらない。
 */
export const createPageProps =
  <T extends Record<string, unknown>>({
    layers,
    fetchProps,
    sMaxAge = 3600,
  }: CreatePagePropsOptions<T> = {}): GetServerSideProps =>
  async (context) => {
    if (layers) {
      const layer = context.params?.layer;
      if (typeof layer !== 'string' || !layers.includes(layer)) {
        return { notFound: true };
      }
    }

    context.res.setHeader('Cache-Control', buildCacheControl(sMaxAge));

    const origin = resolveBaseUrl(context.req.headers);
    const path = context.resolvedUrl.split('?')[0] || '/';

    const meta: SiteMetaProps = {
      origin,
      pageUrl: `${origin}${path}`,
      canonicalUrl: `${CANONICAL_SITE_URL}${path}`,
    };

    const extra = fetchProps ? await fetchProps() : undefined;

    return { props: { ...meta, ...extra } };
  };

/** 記事一覧ページのデータ取得（Qiita/Zenn） */
export const fetchContentPageProps = async () => {
  const result = await getContent();

  if (result.error) {
    // 上流のエラー詳細は露出させず、固定メッセージを返す
    return {
      qiitaPosts: [],
      zennPosts: [],
      error: '記事の取得中にエラーが発生しました。',
    };
  }

  return { qiitaPosts: result.qiitaPosts, zennPosts: result.zennPosts };
};

/** ポートフォリオ一覧ページのデータ取得 */
export const fetchSitePageProps = async () => {
  const portfolios = await getPortfolios();
  return { portfolios: Array.isArray(portfolios) ? portfolios : [] };
};
