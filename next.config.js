const filteredHeaders = [
  {
    key: 'Access-Control-Allow-Origin',
    value: 'https://cti1650-portfolio-site.vercel.app',
  },
  {
    key: 'Access-Control-Allow-Methods',
    value: 'GET,OPTIONS,POST',
  },
  {
    key: 'Access-Control-Allow-Headers',
    value: 'Content-Type',
  },
];

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
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
    return [
      {
        source: '/api/content/(.*)',
        headers: filteredHeaders,
      },
      {
        source: '/api/notion/(.*)',
        headers: filteredHeaders,
      },
      {
        source: '/api/portfolios/(.*)',
        headers: filteredHeaders,
      },
      {
        source: '/api/llms/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type',
          },
        ],
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
        source: '/llms/:path*', // :path* で任意のパスをキャプチャ
        destination: '/api/llms/:path*', // キャプチャしたパスをdestinationで利用
      },
    ];
  },
};

module.exports = nextConfig;
