/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://expences-management.vercel.app',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, Origin, Accept',
          },
        ],
      },
    ];
  },

  // Turbopack এর জন্য Alias Support (Next.js 16-এ খুব জরুরি)
  turbopack: {
    resolveAlias: {
      '@': './',
      '@/components': './components',
      '@/lib': './lib',
      '@/app': './app',
    },
  },
};

export default nextConfig;