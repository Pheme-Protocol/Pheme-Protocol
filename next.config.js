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
    const securityHeaders = [
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        key: 'Access-Control-Allow-Methods',
        value: 'GET, POST, PUT, DELETE, OPTIONS'
      },
      {
        key: 'Access-Control-Allow-Headers',
        value: 'X-Requested-With, Content-Type, Authorization, Accept'
      }
    ];

    // Only add CORS in development
    if (process.env.NODE_ENV === 'development') {
      securityHeaders.push({
        key: 'Access-Control-Allow-Origin',
        value: '*'
      });
    }

    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  },
  // Domain configuration for production
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'https://aurabot.app/api/:path*'
        }
      ];
    }
    return [];
  }
};

module.exports = nextConfig; 