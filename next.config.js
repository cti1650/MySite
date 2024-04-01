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
};

module.exports = nextConfig;
