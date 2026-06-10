/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // garantiza que data/tp.md viaje junto a la API route en el deploy
    outputFileTracingIncludes: {
      '/api/chat': ['./data/**'],
    },
  },
};

export default nextConfig;
