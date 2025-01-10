/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['mshcrvetdqodotbllogr.supabase.co'],
  },
  // Konfigurasi untuk production di Railway
  async redirects() {
    return [];
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.RAILWAY_STATIC_URL || 'https://tubes-tst-recipe-snap-production.up.railway.app'
  }
};

module.exports = nextConfig; 