import type { ContentResponse } from 'src/types/posts';
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
  } catch (e: any) {
    return { error: e.message, qiitaPosts: [], zennPosts: [] };
  }
}
