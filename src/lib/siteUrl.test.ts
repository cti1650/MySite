import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * siteUrl.ts は CANONICAL_SITE_URL と allowedHostPatterns を
 * モジュール読み込み時に process.env から組み立てる。
 * そのため環境変数を変えるテストでは、env を設定してから
 * resetModules() 済みの状態で import し直す必要がある。
 */
const loadWithEnv = async (env: Record<string, string | undefined>) => {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      vi.stubEnv(key, '');
      delete process.env[key];
    } else {
      vi.stubEnv(key, value);
    }
  }
  return import('./siteUrl');
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('CANONICAL_SITE_URL', () => {
  it('NEXT_PUBLIC_SITE_URL を採用し末尾のスラッシュを落とす', async () => {
    const { CANONICAL_SITE_URL } = await loadWithEnv({
      NEXT_PUBLIC_SITE_URL: 'https://example.com///',
    });
    expect(CANONICAL_SITE_URL).toBe('https://example.com');
  });

  it('未設定ならフォールバック先の固定URLになる', async () => {
    const { CANONICAL_SITE_URL } = await loadWithEnv({
      NEXT_PUBLIC_SITE_URL: '',
    });
    expect(CANONICAL_SITE_URL).toBe(
      'https://cti1650-portfolio-site.vercel.app',
    );
  });
});

describe('isAllowedHost', () => {
  it('カノニカルURLのホストを許可する', async () => {
    const { isAllowedHost } = await loadWithEnv({
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
      ALLOWED_HOSTS: '',
    });
    expect(isAllowedHost('example.com')).toBe(true);
  });

  it('許可リストに無いホストは拒否する', async () => {
    const { isAllowedHost } = await loadWithEnv({
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
      ALLOWED_HOSTS: '',
    });
    expect(isAllowedHost('evil.com')).toBe(false);
  });

  it('空・undefined は拒否する', async () => {
    const { isAllowedHost } = await loadWithEnv({
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
    });
    expect(isAllowedHost(undefined)).toBe(false);
    expect(isAllowedHost('')).toBe(false);
    expect(isAllowedHost('   ')).toBe(false);
  });

  it('大文字・末尾ドット・前後空白を正規化して比較する', async () => {
    const { isAllowedHost } = await loadWithEnv({
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
    });
    expect(isAllowedHost('EXAMPLE.COM')).toBe(true);
    expect(isAllowedHost('example.com.')).toBe(true);
    expect(isAllowedHost('  example.com  ')).toBe(true);
  });

  it('ポート付きでもホスト部分で判定する', async () => {
    const { isAllowedHost } = await loadWithEnv({
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
    });
    expect(isAllowedHost('example.com:3000')).toBe(true);
  });

  it('ALLOWED_HOSTS のカンマ区切りを許可する', async () => {
    const { isAllowedHost } = await loadWithEnv({
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
      ALLOWED_HOSTS: 'a.example.net, b.example.org',
    });
    expect(isAllowedHost('a.example.net')).toBe(true);
    expect(isAllowedHost('b.example.org')).toBe(true);
    expect(isAllowedHost('c.example.org')).toBe(false);
  });

  describe('ワイルドカード', () => {
    const env = {
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
      ALLOWED_HOSTS: '*.example.net',
    };

    it('サブドメインを許可する', async () => {
      const { isAllowedHost } = await loadWithEnv(env);
      expect(isAllowedHost('foo.example.net')).toBe(true);
      expect(isAllowedHost('a.b.example.net')).toBe(true);
    });

    it('サブドメイン部分が空の裸ドメインは許可しない', async () => {
      const { isAllowedHost } = await loadWithEnv(env);
      expect(isAllowedHost('example.net')).toBe(false);
    });

    it('接尾辞が一致するだけの別ドメインを許可しない', async () => {
      const { isAllowedHost } = await loadWithEnv(env);
      // 'evilexample.net' は '.example.net' で終わらないので不一致
      expect(isAllowedHost('evilexample.net')).toBe(false);
      // 攻撃者ドメインを後ろに足した形も不一致
      expect(isAllowedHost('foo.example.net.evil.com')).toBe(false);
    });
  });

  it('Vercelが払い出すデプロイURLを許可する', async () => {
    const { isAllowedHost } = await loadWithEnv({
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
      VERCEL_URL: 'deploy-abc123.vercel.app',
      VERCEL_BRANCH_URL: 'branch-xyz.vercel.app',
      VERCEL_PROJECT_PRODUCTION_URL: 'prod.vercel.app',
    });
    expect(isAllowedHost('deploy-abc123.vercel.app')).toBe(true);
    expect(isAllowedHost('branch-xyz.vercel.app')).toBe(true);
    expect(isAllowedHost('prod.vercel.app')).toBe(true);
    expect(isAllowedHost('other.vercel.app')).toBe(false);
  });

  it('本番環境ではlocalhostを許可しない', async () => {
    const { isAllowedHost } = await loadWithEnv({
      NODE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
    });
    expect(isAllowedHost('localhost:3000')).toBe(false);
    expect(isAllowedHost('127.0.0.1')).toBe(false);
  });

  it('開発環境ではlocalhostを許可する', async () => {
    const { isAllowedHost } = await loadWithEnv({
      NODE_ENV: 'development',
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
    });
    expect(isAllowedHost('localhost:3000')).toBe(true);
    expect(isAllowedHost('127.0.0.1:3000')).toBe(true);
    expect(isAllowedHost('[::1]:3000')).toBe(true);
  });
});

describe('resolveBaseUrl', () => {
  it('許可ホストならそのホストを基点に返す', async () => {
    const { resolveBaseUrl } = await loadWithEnv({
      NODE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
      ALLOWED_HOSTS: 'a.example.net',
    });
    expect(resolveBaseUrl({ host: 'a.example.net' })).toBe(
      'https://a.example.net',
    );
  });

  it('許可外ホストはカノニカルURLにフォールバックする', async () => {
    const { resolveBaseUrl } = await loadWithEnv({
      NODE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
    });
    expect(resolveBaseUrl({ host: 'evil.com' })).toBe('https://example.com');
  });

  it('x-forwarded-proto を信用せず常にhttpsを使う', async () => {
    const { resolveBaseUrl } = await loadWithEnv({
      NODE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
    });
    expect(
      resolveBaseUrl({
        host: 'example.com',
        'x-forwarded-proto': 'http',
      }),
    ).toBe('https://example.com');
  });

  it('localhostのみhttpを使う（開発時）', async () => {
    const { resolveBaseUrl } = await loadWithEnv({
      NODE_ENV: 'development',
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
    });
    expect(resolveBaseUrl({ host: 'localhost:3000' })).toBe(
      'http://localhost:3000',
    );
  });

  it('Hostヘッダが無い場合はカノニカルURLを返す', async () => {
    const { resolveBaseUrl } = await loadWithEnv({
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
    });
    expect(resolveBaseUrl({})).toBe('https://example.com');
  });
});

describe('resolveAllowedOrigin', () => {
  const env = {
    NODE_ENV: 'production',
    NEXT_PUBLIC_SITE_URL: 'https://example.com',
    ALLOWED_HOSTS: '*.example.net',
  };

  it('許可ホストのOriginをそのまま返す', async () => {
    const { resolveAllowedOrigin } = await loadWithEnv(env);
    expect(resolveAllowedOrigin('https://example.com')).toBe(
      'https://example.com',
    );
    expect(resolveAllowedOrigin('https://foo.example.net')).toBe(
      'https://foo.example.net',
    );
  });

  it('許可外Originはnullを返す（反射しない）', async () => {
    const { resolveAllowedOrigin } = await loadWithEnv(env);
    expect(resolveAllowedOrigin('https://evil.com')).toBeNull();
  });

  it('文字列 "null" Origin はnullを返す', async () => {
    const { resolveAllowedOrigin } = await loadWithEnv(env);
    expect(resolveAllowedOrigin('null')).toBeNull();
  });

  it('未指定・空はnullを返す', async () => {
    const { resolveAllowedOrigin } = await loadWithEnv(env);
    expect(resolveAllowedOrigin(undefined)).toBeNull();
    expect(resolveAllowedOrigin('')).toBeNull();
  });

  it('配列で渡された場合は先頭を使う', async () => {
    const { resolveAllowedOrigin } = await loadWithEnv(env);
    expect(
      resolveAllowedOrigin(['https://example.com', 'https://evil.com']),
    ).toBe('https://example.com');
    expect(
      resolveAllowedOrigin(['https://evil.com', 'https://example.com']),
    ).toBeNull();
  });

  it('URLとして壊れた値はnullを返す', async () => {
    const { resolveAllowedOrigin } = await loadWithEnv(env);
    expect(resolveAllowedOrigin('http://')).toBeNull();
    expect(resolveAllowedOrigin('::::')).toBeNull();
  });

  it('スキーム無しの値はhttpsを補って判定する', async () => {
    const { resolveAllowedOrigin } = await loadWithEnv(env);
    expect(resolveAllowedOrigin('example.com')).toBe('https://example.com');
  });
});
