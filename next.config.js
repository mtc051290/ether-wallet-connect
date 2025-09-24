/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors (only use if you know what you're doing)
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
