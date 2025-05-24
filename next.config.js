/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true
  },
  transpilePackages: ['@reown/appkit', '@reown/appkit-adapter-wagmi', 'wagmi', 'viem'],
  webpack: (config, { isServer }) => {
    // Add handling for .mjs files
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
    };
    return config;
  },
  // Security headers configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization, Accept'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https://aurabot.app https://*.aurabot.app https://*.vercel.app; " +
                   "img-src 'self' data: https://aurabot.app https://*.aurabot.app https://*.vercel.app; " +
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                   "style-src 'self' 'unsafe-inline'; " +
                   "connect-src 'self' https://aurabot.app https://*.aurabot.app https://*.vercel.app https://api.openai.com; " +
                   "frame-ancestors 'none';"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ],
      }
    ];
  },
  // Simplified rewrites
  async rewrites() {
    return [];
  }
};

module.exports = nextConfig; 