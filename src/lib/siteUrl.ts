import type { IncomingHttpHeaders } from 'node:http';

/**
 * 複数ドメインでの公開に対応するためのホスト解決ユーティリティ。
 *
 * Hostヘッダはクライアントが自由に詐称できるため、そのまま使うとSSRF・
 * キャッシュ汚染・XML/コンテンツ注入の起点になる。ここでは「許可リストに
 * 載っているホストであれば動的に採用し、そうでなければカノニカルURLに
 * フォールバックする」という方針で、ドメイン追加時の設定変更だけで
 * 追従できるようにしている。
 */

const isDev = process.env.NODE_ENV !== 'production';

const LOCAL_HOSTS = ['localhost', '127.0.0.1', '[::1]'];

const normalizeHost = (value: string | undefined | null): string =>
  (value ?? '').trim().toLowerCase().replace(/\.$/, '');

/** `example.com:3000` や `[::1]:3000` からポート部分を落とす */
const stripPort = (host: string): string => {
  if (host.startsWith('[')) {
    const end = host.indexOf(']');
    return end === -1 ? host : host.slice(0, end + 1);
  }
  const index = host.lastIndexOf(':');
  return index === -1 ? host : host.slice(0, index);
};

const hostFromUrl = (url: string): string => {
  try {
    return normalizeHost(new URL(url).host);
  } catch {
    return '';
  }
};

const withScheme = (value: string): string =>
  /^https?:\/\//.test(value) ? value : `https://${value}`;

/** カノニカル（正規）サイトURL。許可外ホストからのアクセス時のフォールバック */
export const CANONICAL_SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://cti1650-portfolio-site.vercel.app'
).replace(/\/+$/, '');

/**
 * 許可ホストのパターン一覧。
 * - `NEXT_PUBLIC_SITE_URL` のホスト
 * - `ALLOWED_HOSTS`（カンマ区切り。`*.example.com` のワイルドカード可）
 * - Vercelが払い出すデプロイURL（プレビュー環境で自動追従させるため）
 */
const allowedHostPatterns: string[] = [
  hostFromUrl(CANONICAL_SITE_URL),
  ...(process.env.ALLOWED_HOSTS ?? '')
    .split(',')
    .map((entry) => normalizeHost(entry)),
  normalizeHost(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  normalizeHost(process.env.VERCEL_BRANCH_URL),
  normalizeHost(process.env.VERCEL_URL),
].filter(Boolean);

/** Hostヘッダ／Originのホストが公開を許可されたドメインかどうか */
export const isAllowedHost = (rawHost: string | undefined): boolean => {
  const host = normalizeHost(rawHost);
  if (!host) return false;

  const bareHost = stripPort(host);
  if (isDev && LOCAL_HOSTS.includes(bareHost)) return true;

  return allowedHostPatterns.some((pattern) => {
    if (pattern.startsWith('*.')) {
      const suffix = pattern.slice(1); // '*.example.com' -> '.example.com'
      return bareHost.endsWith(suffix) && bareHost.length > suffix.length;
    }
    return bareHost === stripPort(pattern);
  });
};

/**
 * リクエストの接続先ドメインを解決する。
 * 許可済みホストならそのドメインを、未知のホストならカノニカルURLを返す。
 * スキームはヘッダ（`x-forwarded-proto`）を信用せず、ローカル以外は常にhttps。
 */
export const resolveBaseUrl = (headers: IncomingHttpHeaders): string => {
  const host = normalizeHost(headers.host);
  if (!isAllowedHost(host)) return CANONICAL_SITE_URL;

  const scheme = LOCAL_HOSTS.includes(stripPort(host)) ? 'http' : 'https';
  return `${scheme}://${host}`;
};

/**
 * CORSで反射してよいOriginを解決する。
 * 許可リストに載っていないOriginはnullを返す（＝反射しない）。
 */
export const resolveAllowedOrigin = (
  originHeader: string | string[] | undefined,
): string | null => {
  const raw = Array.isArray(originHeader) ? originHeader[0] : originHeader;
  if (!raw || raw === 'null') return null;

  try {
    const url = new URL(withScheme(raw));
    return isAllowedHost(url.host) ? url.origin : null;
  } catch {
    return null;
  }
};
