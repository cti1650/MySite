/**
 * 外部API（Notion / Qiita / Zenn）向けのサーバサイドキャッシュ。
 *
 * ページをSSGからSSRへ移行したことで、外部APIの応答がページ表示の
 * 可用性とレイテンシに直結するようになった。SSGは生成に失敗しても
 * 前回の成果物を返せるが、SSRにはその後ろ盾がない。
 * そのため以下の3点をオリジン側で担保する。
 *
 * - stale-while-revalidate: TTL切れでも古い値を即返し、更新は裏で走らせる
 * - stale-if-error:         取得失敗時は最後に成功した値を返し続ける
 * - single-flight:          同時アクセスが重なっても上流への呼び出しは1本
 */

type CacheEntry<T> = { value: T; fetchedAt: number };

type CachedFetcherOptions<T> = {
  /** この期間内は取得済みの値をそのまま返す（ミリ秒） */
  ttlMs: number;
  /**
   * 取得結果を「成功」とみなすか。
   * 上流の関数は例外ではなく空配列やerrorプロパティで失敗を表すため、
   * 呼び出し側で成功条件を明示する。
   */
  isSuccess: (value: T) => boolean;
};

export const createCachedFetcher = <T>(
  fetcher: () => Promise<T>,
  { ttlMs, isSuccess }: CachedFetcherOptions<T>,
): (() => Promise<T>) => {
  let entry: CacheEntry<T> | null = null;
  let inflight: Promise<T> | null = null;

  const refresh = (): Promise<T> => {
    if (inflight) return inflight;

    inflight = fetcher()
      .then((value) => {
        if (isSuccess(value)) {
          entry = { value, fetchedAt: Date.now() };
          return value;
        }
        // 失敗時は最後に成功した値を返し続ける
        return entry ? entry.value : value;
      })
      .catch((e) => {
        if (entry) return entry.value;
        throw e;
      })
      .finally(() => {
        inflight = null;
      });

    return inflight;
  };

  return async () => {
    const now = Date.now();

    if (entry) {
      // TTL切れなら裏で更新しつつ、古い値を即座に返す
      if (now - entry.fetchedAt >= ttlMs) {
        void refresh().catch(() => {
          // 裏の更新失敗は握りつぶす（呼び出し元には古い値を返済み）
        });
      }
      return entry.value;
    }

    return refresh();
  };
};
