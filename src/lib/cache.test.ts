import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildCacheControl,
  createCachedFetcher,
  STALE_WHILE_REVALIDATE_SECONDS,
} from './cache';

describe('buildCacheControl', () => {
  it('ブラウザには再検証させ、CDNには s-maxage を効かせる', () => {
    expect(buildCacheControl(3600)).toBe(
      `public, max-age=0, s-maxage=3600, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`,
    );
  });

  it('stale-while-revalidate は24時間', () => {
    expect(STALE_WHILE_REVALIDATE_SECONDS).toBe(86400);
  });
});

describe('createCachedFetcher', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const alwaysSuccess = () => true;

  it('初回は上流を呼び、値を返す', async () => {
    const fetcher = vi.fn().mockResolvedValue('v1');
    const get = createCachedFetcher(fetcher, {
      ttlMs: 1000,
      isSuccess: alwaysSuccess,
    });

    await expect(get()).resolves.toBe('v1');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('TTL内は上流を呼ばずキャッシュを返す', async () => {
    const fetcher = vi.fn().mockResolvedValue('v1');
    const get = createCachedFetcher(fetcher, {
      ttlMs: 1000,
      isSuccess: alwaysSuccess,
    });

    await get();
    vi.advanceTimersByTime(999);
    await expect(get()).resolves.toBe('v1');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  describe('stale-while-revalidate', () => {
    it('TTL切れでは古い値を即返し、更新は裏で走る', async () => {
      const fetcher = vi
        .fn()
        .mockResolvedValueOnce('v1')
        .mockResolvedValueOnce('v2');
      const get = createCachedFetcher(fetcher, {
        ttlMs: 1000,
        isSuccess: alwaysSuccess,
      });

      await get();
      vi.advanceTimersByTime(1000);

      // 呼び出し元は待たされず古い値を受け取る
      await expect(get()).resolves.toBe('v1');
      expect(fetcher).toHaveBeenCalledTimes(2);

      // 裏の更新が終わると次回から新しい値になる
      await vi.waitFor(async () => {
        expect(await get()).toBe('v2');
      });
    });
  });

  describe('stale-if-error', () => {
    it('上流が例外を投げても最後に成功した値を返し続ける', async () => {
      const fetcher = vi
        .fn()
        .mockResolvedValueOnce('v1')
        .mockRejectedValue(new Error('upstream down'));
      const get = createCachedFetcher(fetcher, {
        ttlMs: 1000,
        isSuccess: alwaysSuccess,
      });

      await get();
      vi.advanceTimersByTime(1000);

      await expect(get()).resolves.toBe('v1');
      // 裏の更新が失敗しても呼び出し元には伝播しない
      await expect(get()).resolves.toBe('v1');
    });

    it('isSuccess が false の結果はキャッシュを上書きしない', async () => {
      const fetcher = vi
        .fn()
        .mockResolvedValueOnce(['ok'])
        .mockResolvedValue([]);
      const get = createCachedFetcher<string[]>(fetcher, {
        ttlMs: 1000,
        isSuccess: (value) => value.length > 0,
      });

      await expect(get()).resolves.toEqual(['ok']);
      vi.advanceTimersByTime(1000);

      await get();
      await vi.waitFor(async () => {
        expect(await get()).toEqual(['ok']);
      });
    });

    it('一度も成功していない状態で失敗したら例外を投げる', async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error('upstream down'));
      const get = createCachedFetcher(fetcher, {
        ttlMs: 1000,
        isSuccess: alwaysSuccess,
      });

      await expect(get()).rejects.toThrow('upstream down');
    });

    it('一度も成功していない状態で isSuccess が false ならその値を返す', async () => {
      const fetcher = vi.fn().mockResolvedValue([]);
      const get = createCachedFetcher<string[]>(fetcher, {
        ttlMs: 1000,
        isSuccess: (value) => value.length > 0,
      });

      await expect(get()).resolves.toEqual([]);
    });
  });

  describe('single-flight', () => {
    it('初回の同時アクセスでも上流への呼び出しは1本', async () => {
      let resolveFetch: (value: string) => void = () => {};
      const fetcher = vi.fn().mockImplementation(
        () =>
          new Promise<string>((resolve) => {
            resolveFetch = resolve;
          }),
      );
      const get = createCachedFetcher(fetcher, {
        ttlMs: 1000,
        isSuccess: alwaysSuccess,
      });

      const results = Promise.all([get(), get(), get()]);
      resolveFetch('v1');

      await expect(results).resolves.toEqual(['v1', 'v1', 'v1']);
      expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('裏での更新が走っている間は追加の上流呼び出しをしない', async () => {
      let resolveFetch: (value: string) => void = () => {};
      const fetcher = vi
        .fn()
        .mockResolvedValueOnce('v1')
        .mockImplementation(
          () =>
            new Promise<string>((resolve) => {
              resolveFetch = resolve;
            }),
        );
      const get = createCachedFetcher(fetcher, {
        ttlMs: 1000,
        isSuccess: alwaysSuccess,
      });

      await get();
      vi.advanceTimersByTime(1000);

      // 更新中に何度アクセスされても上流は1本だけ増える
      await get();
      await get();
      await get();
      expect(fetcher).toHaveBeenCalledTimes(2);

      resolveFetch('v2');
      await vi.waitFor(async () => {
        expect(await get()).toBe('v2');
      });
    });
  });
});
