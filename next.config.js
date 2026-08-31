/**
 * Content-Security-Policy。
 * インラインスクリプト（GA初期化）とMantineのインラインstyleがあるため
 * script-src/style-src には 'unsafe-inline' が必要。
 * それ以外は明示した配信元のみに限定し、frame-ancestors/base-uri/form-action で
 * クリックジャッキングとフォーム乗っ取りを塞ぐ。
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://udify.app",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://udify.app",
  'frame-src https://udify.app',
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
];

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.wantedly.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'd2v9k5u4v94ulw.cloudfront.net' },
      { protocol: 'https', hostname: 'huntr-assets.s3.amazonaws.com' },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'i.gyazo.com' },
    ],
  },
  async headers() {
    // CORSは複数ドメイン公開に追従させるため src/lib/cors.ts で
    // リクエスト単位に解決する（ここでは静的に設定しない）
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/llms.txt',
        destination: '/api/llms/index.txt',
      },
      {
        source: '/llms-full.txt',
        destination: '/api/llms/full.txt',
      },
      {
        source: '/llms/:path*', // :path* で任意のパスをキャプチャ
        destination: '/api/llms/:path*', // キャプチャしたパスをdestinationで利用
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
      },
    ];
  },
};

module.exports = nextConfig;
