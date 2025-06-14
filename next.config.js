/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  extends: ['plugin:@next/next/recommended', 'eslint:recommended', 'next'],
  images: {
    domains: [
      'images.wantedly.com',
      'lh3.googleusercontent.com',
      'd2v9k5u4v94ulw.cloudfront.net',
      'huntr-assets.s3.amazonaws.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com',
      'www.notion.so',
      'i.gyazo.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
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
        source: '/llms/:path*',
        destination: '/api/llms/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
