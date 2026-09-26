import type { NextApiRequest } from 'next';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getClientIp, logSecurityEvent } from './logger';

type RequestOverrides = {
  headers?: NextApiRequest['headers'];
  method?: string;
  url?: string;
  /** null を渡すとソケットのアドレス自体が無い状態を表す */
  remoteAddress?: string | null;
};

const buildRequest = ({
  headers = {},
  method = 'POST',
  url = '/api/notion/form',
  remoteAddress = '203.0.113.9',
}: RequestOverrides = {}) =>
  ({
    headers,
    method,
    url,
    socket: { remoteAddress: remoteAddress ?? undefined },
  }) as unknown as NextApiRequest;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getClientIp', () => {
  it('x-forwarded-for の先頭（最も外側のクライアント）を使う', () => {
    const req = buildRequest({
      headers: { 'x-forwarded-for': '198.51.100.1, 10.0.0.1, 10.0.0.2' },
    });
    expect(getClientIp(req)).toBe('198.51.100.1');
  });

  it('前後の空白を除去する', () => {
    const req = buildRequest({
      headers: { 'x-forwarded-for': '  198.51.100.1  , 10.0.0.1' },
    });
    expect(getClientIp(req)).toBe('198.51.100.1');
  });

  it('配列で渡された場合は先頭の要素を使う', () => {
    const req = buildRequest({
      headers: { 'x-forwarded-for': ['198.51.100.1', '198.51.100.2'] },
    });
    expect(getClientIp(req)).toBe('198.51.100.1');
  });

  it('ヘッダが無ければソケットのアドレスにフォールバックする', () => {
    const req = buildRequest({ remoteAddress: '203.0.113.9' });
    expect(getClientIp(req)).toBe('203.0.113.9');
  });

  it('空のヘッダ値でもソケットのアドレスにフォールバックする', () => {
    const req = buildRequest({
      headers: { 'x-forwarded-for': '' },
      remoteAddress: '203.0.113.9',
    });
    expect(getClientIp(req)).toBe('203.0.113.9');
  });

  it('どちらも無ければ unknown を返す', () => {
    const req = buildRequest({ remoteAddress: null });
    expect(getClientIp(req)).toBe('unknown');
  });
});

describe('logSecurityEvent', () => {
  /** 出力された1行のJSONをパースして返す */
  const captureLog = (level: 'log' | 'warn' | 'error') =>
    vi.spyOn(console, level).mockImplementation(() => {});

  it('1行のJSONとして出力する', () => {
    const spy = captureLog('log');
    logSecurityEvent(buildRequest(), {
      event: 'contact_form',
      outcome: 'success',
    });

    expect(spy).toHaveBeenCalledTimes(1);
    const line = spy.mock.calls[0]?.[0] as string;
    expect(line.includes('\n')).toBe(false);
    expect(() => JSON.parse(line)).not.toThrow();
  });

  it('リクエストの非識別情報を含める', () => {
    const spy = captureLog('log');
    logSecurityEvent(
      buildRequest({
        headers: {
          host: 'example.com',
          'user-agent': 'curl/8.0',
          'x-forwarded-for': '198.51.100.1',
        },
      }),
      { event: 'contact_form', outcome: 'success' },
    );

    const record = JSON.parse(spy.mock.calls[0]?.[0] as string);
    expect(record).toMatchObject({
      type: 'security',
      level: 'info',
      event: 'contact_form',
      outcome: 'success',
      method: 'POST',
      path: '/api/notion/form',
      host: 'example.com',
      ip: '198.51.100.1',
      userAgent: 'curl/8.0',
    });
    expect(typeof record.timestamp).toBe('string');
  });

  describe('severity の決定', () => {
    it('success なら info（console.log）', () => {
      const spy = captureLog('log');
      logSecurityEvent(buildRequest(), {
        event: 'e',
        outcome: 'success',
      });
      expect(JSON.parse(spy.mock.calls[0]?.[0] as string).level).toBe('info');
    });

    it('rejected なら warn（console.warn）', () => {
      const spy = captureLog('warn');
      logSecurityEvent(buildRequest(), {
        event: 'e',
        outcome: 'rejected',
      });
      expect(JSON.parse(spy.mock.calls[0]?.[0] as string).level).toBe('warn');
    });

    it('failure なら warn（console.warn）', () => {
      const spy = captureLog('warn');
      logSecurityEvent(buildRequest(), {
        event: 'e',
        outcome: 'failure',
      });
      expect(JSON.parse(spy.mock.calls[0]?.[0] as string).level).toBe('warn');
    });

    it('severity を明示すればそれを優先し、error は console.error に出す', () => {
      const spy = captureLog('error');
      logSecurityEvent(buildRequest(), {
        event: 'e',
        outcome: 'failure',
        severity: 'error',
      });
      expect(JSON.parse(spy.mock.calls[0]?.[0] as string).level).toBe('error');
    });
  });

  it('detail を展開して含める', () => {
    const spy = captureLog('warn');
    logSecurityEvent(buildRequest(), {
      event: 'contact_form',
      outcome: 'rejected',
      detail: { reason: 'validation', issues: 3, throttled: false },
    });

    expect(JSON.parse(spy.mock.calls[0]?.[0] as string)).toMatchObject({
      reason: 'validation',
      issues: 3,
      throttled: false,
    });
  });

  it('リクエスト本文やPIIを出力しない', () => {
    const spy = captureLog('log');
    logSecurityEvent(
      // body に個人情報が入っていても出力に混ざらないこと
      buildRequest({
        headers: { host: 'example.com' },
      }),
      { event: 'contact_form', outcome: 'success' },
    );

    const record = JSON.parse(spy.mock.calls[0]?.[0] as string);
    expect(Object.keys(record)).not.toContain('body');
    expect(Object.keys(record)).not.toContain('name');
    expect(Object.keys(record)).not.toContain('email');
  });
});
