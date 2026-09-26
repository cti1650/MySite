import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAge } from './useAge';

/**
 * 現在日付に依存するため、システム時刻を固定して検証する。
 * 固定しないと誕生日の前後で結果が変わり、特定の日にだけ落ちるテストになる。
 */
const at = (iso: string) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(iso));
};

afterEach(() => {
  vi.useRealTimers();
});

describe('useAge', () => {
  it('誕生日を過ぎていればその年齢を返す', () => {
    at('2026-06-01T00:00:00');
    const { result } = renderHook(() => useAge(1992, 1, 25));
    expect(result.current[0]).toBe(34);
  });

  it('誕生日より前なら1つ若い年齢を返す', () => {
    at('2026-01-01T00:00:00');
    const { result } = renderHook(() => useAge(1992, 1, 25));
    expect(result.current[0]).toBe(33);
  });

  it('誕生日当日は加算済みの年齢を返す', () => {
    at('2026-01-25T00:00:00');
    const { result } = renderHook(() => useAge(1992, 1, 25));
    expect(result.current[0]).toBe(34);
  });

  it('誕生日の前日はまだ加算しない', () => {
    at('2026-01-24T23:59:59');
    const { result } = renderHook(() => useAge(1992, 1, 25));
    expect(result.current[0]).toBe(33);
  });

  it('12月生まれで年末をまたぐ場合も正しく数える', () => {
    at('2026-12-31T00:00:00');
    const { result } = renderHook(() => useAge(2000, 12, 31));
    expect(result.current[0]).toBe(26);
  });

  it('2月29日生まれでも平年に落ちない', () => {
    at('2026-03-01T00:00:00');
    const { result } = renderHook(() => useAge(2000, 2, 29));
    // 平年の2/29は3/1として解釈されるため、3/1時点で加算済み
    expect(result.current[0]).toBe(26);
  });

  it('生年が当年なら0を返す', () => {
    at('2026-06-01T00:00:00');
    const { result } = renderHook(() => useAge(2026, 1, 1));
    expect(result.current[0]).toBe(0);
  });

  it('引数が変わると再計算する', () => {
    at('2026-06-01T00:00:00');
    const { result, rerender } = renderHook(
      ({ year }: { year: number }) => useAge(year, 1, 25),
      { initialProps: { year: 1992 } },
    );
    expect(result.current[0]).toBe(34);

    rerender({ year: 2000 });
    expect(result.current[0]).toBe(26);
  });

  it('同じ引数なら再レンダーしても同じ値を返す', () => {
    at('2026-06-01T00:00:00');
    const { result, rerender } = renderHook(() => useAge(1992, 1, 25));
    const first = result.current[0];
    rerender();
    expect(result.current[0]).toBe(first);
  });
});
