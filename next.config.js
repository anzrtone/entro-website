/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/entro-website',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;