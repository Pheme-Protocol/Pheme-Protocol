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
  // Enhanced domain configuration
  async headers() {
    const allowedOrigins = [
      'https://aurabot.app',
      'https://www.aurabot.app',
      'http://localhost:3000',
      'http://localhost:3002'
    ];

    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'  // Temporarily allow all origins while debugging
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
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          }
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'  // Temporarily allow all origins while debugging
          }
        ],
      }
    ];
  },
  // Simplified rewrites configuration
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        }
      ]
    };
  },
  // Add redirects to handle www to non-www
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.aurabot.app',
          },
        ],
        destination: 'https://aurabot.app/:path*',
        permanent: true,
      },
    ];
  }
};

module.exports = nextConfig; 