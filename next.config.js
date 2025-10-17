/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // نه export
  experimental: {
    dynamicIO: true,
  },
  // اگر خواستی ثابت‌تر باشه:
  // reactStrictMode: true,
};

module.exports = nextConfig;
