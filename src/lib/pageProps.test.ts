import type { GetServerSidePropsContext } from 'next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * createPageProps は全ページ共通の getServerSideProps を組み立てる。
 *
 * ここで守りたい契約は3つ。
 * - layers 指定時に未知のレイヤーを404にする（SSGの fallback: false の代替）
 * - CDNキャッシュのヘッダを必ず付ける
 * - og:url / canonical 用のメタをアクセス先ホストから組み立てる
 */

const getContent = vi.fn();
const getPortfolios = vi.fn();

vi.mock('./contentApi', () => ({ getContent }));
vi.mock('./portfolioApi', () => ({ getPortfolios }));

const { createPageProps, fetchContentPageProps, fetchSitePageProps } =
  await import('./pageProps');

type ContextOverrides = {
  host?: string;
  resolvedUrl?: string;
  params?: Record<string, string | string[]>;
};

const setHeader = vi.fn();

const buildContext = ({
  host = 'cti1650-portfolio-site.vercel.app',
  resolvedUrl = '/',
  params = {},
}: ContextOverrides = {}) =>
  ({
    req: { headers: { host } },
    res: { setHeader },
    params,
    resolvedUrl,
  }) as unknown as GetServerSidePropsContext;

beforeEach(() => {
  setHeader.mockClear();
  getContent.mockReset();
  getPortfolios.mockReset();
});

describe('createPageProps', () => {
  describe('layers によるレイヤーの絞り込み', () => {
    it('許可レイヤーならpropsを返す', async () => {
      const handler = createPageProps({ layers: ['biz', 'libe'] });
      const result = await handler(buildContext({ params: { layer: 'biz' } }));

      expect(result).not.toHaveProperty('notFound');
      expect(result).toHaveProperty('props');
    });

    it('未知のレイヤーは404にする', async () => {
      const handler = createPageProps({ layers: ['biz'] });
      const result = await handler(buildContext({ params: { layer: 'nope' } }));

      expect(result).toEqual({ notFound: true });
    });

    it('layer が無い場合も404にする', async () => {
      const handler = createPageProps({ layers: ['biz'] });
      expect(await handler(buildContext({ params: {} }))).toEqual({
        notFound: true,
      });
    });

    it('layer が配列（catch-all）の場合も404にする', async () => {
      const handler = createPageProps({ layers: ['biz'] });
      const result = await handler(
        buildContext({ params: { layer: ['biz'] } }),
      );
      expect(result).toEqual({ notFound: true });
    });

    it('layers 未指定なら絞り込まない', async () => {
      const handler = createPageProps();
      const result = await handler(buildContext({ params: { layer: 'nope' } }));
      expect(result).not.toHaveProperty('notFound');
    });

    it('404の場合はデータ取得を行わない', async () => {
      const fetchProps = vi.fn();
      const handler = createPageProps({ layers: ['biz'], fetchProps });
      await handler(buildContext({ params: { layer: 'nope' } }));

      expect(fetchProps).not.toHaveBeenCalled();
    });
  });

  describe('キャッシュヘッダ', () => {
    it('既定では s-maxage=3600 を設定する', async () => {
      await createPageProps()(buildContext());

      expect(setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      );
    });

    it('sMaxAge を指定すると反映される', async () => {
      await createPageProps({ sMaxAge: 60 })(buildContext());

      expect(setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'public, max-age=0, s-maxage=60, stale-while-revalidate=86400',
      );
    });
  });

  describe('メタ情報', () => {
    it('アクセス先ホストとパスから pageUrl を組み立てる', async () => {
      const result = await createPageProps()(
        buildContext({ resolvedUrl: '/content' }),
      );

      expect(result).toMatchObject({
        props: {
          origin: 'https://cti1650-portfolio-site.vercel.app',
          pageUrl: 'https://cti1650-portfolio-site.vercel.app/content',
        },
      });
    });

    it('クエリ文字列を pageUrl から除く', async () => {
      const result = await createPageProps()(
        buildContext({ resolvedUrl: '/content?page=2&q=a' }),
      );

      expect(result).toMatchObject({
        props: { pageUrl: 'https://cti1650-portfolio-site.vercel.app/content' },
      });
    });

    it('許可外ホストはカノニカルURLにフォールバックする', async () => {
      const result = await createPageProps()(
        buildContext({ host: 'evil.com', resolvedUrl: '/' }),
      );

      expect(result).toMatchObject({
        props: { origin: 'https://cti1650-portfolio-site.vercel.app' },
      });
    });
  });

  describe('fetchProps', () => {
    it('取得結果をメタとマージして返す', async () => {
      const handler = createPageProps({
        fetchProps: async () => ({ items: [1, 2] }),
      });
      const result = await handler(buildContext());

      expect(result).toMatchObject({
        props: {
          items: [1, 2],
          origin: 'https://cti1650-portfolio-site.vercel.app',
        },
      });
    });

    it('fetchProps 未指定ならメタのみを返す', async () => {
      const result = await createPageProps()(buildContext());

      if ('props' in result) {
        expect(Object.keys(result.props).sort()).toEqual(['origin', 'pageUrl']);
      } else {
        throw new Error('props が返っていない');
      }
    });
  });
});

describe('fetchContentPageProps', () => {
  it('取得成功時は記事一覧を返す', async () => {
    getContent.mockResolvedValue({
      qiitaPosts: [{ id: '1' }],
      zennPosts: [{ id: '2' }],
    });

    expect(await fetchContentPageProps()).toEqual({
      qiitaPosts: [{ id: '1' }],
      zennPosts: [{ id: '2' }],
    });
  });

  it('失敗時は上流のエラー詳細を露出せず固定メッセージを返す', async () => {
    getContent.mockResolvedValue({
      qiitaPosts: [],
      zennPosts: [],
      error: 'ECONNREFUSED 10.0.0.1:443',
    });

    const result = await fetchContentPageProps();
    expect(result).toEqual({
      qiitaPosts: [],
      zennPosts: [],
      error: '記事の取得中にエラーが発生しました。',
    });
    expect(JSON.stringify(result)).not.toContain('10.0.0.1');
  });
});

describe('fetchSitePageProps', () => {
  it('ポートフォリオ一覧を返す', async () => {
    getPortfolios.mockResolvedValue([{ name: 'A' }]);
    expect(await fetchSitePageProps()).toEqual({
      portfolios: [{ name: 'A' }],
    });
  });

  it('配列以外が返ってきても空配列に正規化する', async () => {
    getPortfolios.mockResolvedValue(undefined);
    expect(await fetchSitePageProps()).toEqual({ portfolios: [] });
  });
});
