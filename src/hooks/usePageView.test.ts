import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * usePageView は next/router のイベントに購読し、gtag へ送信する。
 *
 * ここで守りたいのは「アンマウント時に購読を解除すること」。
 * React のメジャー移行では effect のクリーンアップ呼び出しが
 * 挙動変化の影響を受けやすく、解除漏れはリスナーの蓄積に直結する。
 *
 * gtag.existsGaId はモジュール読み込み時に環境変数から決まるため、
 * env を設定してから import する。
 */

const events = {
  on: vi.fn(),
  off: vi.fn(),
};

vi.mock('next/router', () => ({
  useRouter: () => ({ events }),
}));

const loadHook = async (gaId: string) => {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_GOOGLE_ANALYTICS_ID', gaId);
  const [{ usePageView }, gtag] = await Promise.all([
    import('./usePageView'),
    import('@lib/gtag'),
  ]);
  return { usePageView, gtag };
};

beforeEach(() => {
  events.on.mockClear();
  events.off.mockClear();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('usePageView', () => {
  describe('GA ID が設定されている場合', () => {
    it('routeChangeComplete を購読する', async () => {
      const { usePageView } = await loadHook('G-TEST123');
      renderHook(() => usePageView());

      expect(events.on).toHaveBeenCalledTimes(1);
      expect(events.on).toHaveBeenCalledWith(
        'routeChangeComplete',
        expect.any(Function),
      );
    });

    it('アンマウント時に購読を解除する', async () => {
      const { usePageView } = await loadHook('G-TEST123');
      const { unmount } = renderHook(() => usePageView());

      expect(events.off).not.toHaveBeenCalled();
      unmount();

      expect(events.off).toHaveBeenCalledTimes(1);
      // 登録したものと同一のハンドラを解除している
      expect(events.off).toHaveBeenCalledWith(
        'routeChangeComplete',
        events.on.mock.calls[0]?.[1],
      );
    });

    it('遷移時に pageview を送る', async () => {
      const { usePageView, gtag } = await loadHook('G-TEST123');
      const pageview = vi.spyOn(gtag, 'pageview').mockImplementation(() => {});
      renderHook(() => usePageView());

      const handler = events.on.mock.calls[0]?.[1] as (
        path: string,
        options: { shallow: boolean },
      ) => void;
      handler('/next-page', { shallow: false });

      expect(pageview).toHaveBeenCalledWith('/next-page');
    });

    it('shallow な遷移では pageview を送らない', async () => {
      const { usePageView, gtag } = await loadHook('G-TEST123');
      const pageview = vi.spyOn(gtag, 'pageview').mockImplementation(() => {});
      renderHook(() => usePageView());

      const handler = events.on.mock.calls[0]?.[1] as (
        path: string,
        options: { shallow: boolean },
      ) => void;
      handler('/same-page?q=1', { shallow: true });

      expect(pageview).not.toHaveBeenCalled();
    });
  });

  describe('GA ID が未設定の場合', () => {
    it('購読しない', async () => {
      const { usePageView } = await loadHook('');
      renderHook(() => usePageView());
      expect(events.on).not.toHaveBeenCalled();
    });

    it('アンマウントしても解除を呼ばない', async () => {
      const { usePageView } = await loadHook('');
      const { unmount } = renderHook(() => usePageView());
      unmount();
      expect(events.off).not.toHaveBeenCalled();
    });
  });
});
