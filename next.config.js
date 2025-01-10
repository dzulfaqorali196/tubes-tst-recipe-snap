/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['mshcrvetdqodotbllogr.supabase.co'],
  },
  // Konfigurasi untuk production di Railway
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ];
  },
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.RAILWAY_STATIC_URL || 'https://tubes-tst-recipe-snap-production.up.railway.app'
  }
};

module.exports = nextConfig; 