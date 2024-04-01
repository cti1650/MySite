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
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://cti1650-portfolio-site.vercel.app' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
