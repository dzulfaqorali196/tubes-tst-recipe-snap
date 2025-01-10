/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['mshcrvetdqodotbllogr.supabase.co'],
  },
  webServer: {
    hostname: '0.0.0.0',
    port: parseInt(process.env.PORT || '3000', 10)
  }
};

module.exports = nextConfig; 