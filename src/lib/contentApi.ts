import type { ContentResponse } from 'src/types/posts';
import { createCachedFetcher } from './cache';
import { fetchQiita } from './qiitaApi';
import { fetchZenn } from './zennApi';

export async function fetchContent(): Promise<ContentResponse> {
  try {
    const qiitaRes = await fetchQiita();
    const zennRes = await fetchZenn();

    if ('error' in qiitaRes || 'error' in zennRes) {
      throw new Error(qiitaRes.error || zennRes.error);
    }

    if (
      (qiitaRes.code && qiitaRes.code !== 200) ||
      (zennRes.code && zennRes.code !== 200)
    ) {
      return {
        error: 'QiitaまたはZennのデータ取得に失敗しました',
        qiitaPosts: [],
        zennPosts: [],
      };
    }
    return { qiitaPosts: qiitaRes.items || [], zennPosts: zennRes.items || [] };
  } catch (e: unknown) {
    return {
      error: e instanceof Error ? e.message : 'Unknown error',
      qiitaPosts: [],
      zennPosts: [],
    };
  }
}

/**
 * ページ・llms.txt から使うキャッシュ付き取得。
 * 上流が落ちている間は最後に成功した記事一覧を返し続ける。
 */
export const getContent = createCachedFetcher(fetchContent, {
  ttlMs: 3600 * 1000,
  isSuccess: (result) => !result.error,
});
