/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'phemeai.xyz', 'pheme-protocol.vercel.app'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  transpilePackages: ['@reown/appkit', '@reown/appkit-adapter-wagmi', 'wagmi', 'viem'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
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
  async headers() {
    const baseHeaders = [
      {
        key: 'X-Frame-Options',
        value: 'DENY'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
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

    if (process.env.NODE_ENV === 'development') {
      baseHeaders.push({
        key: 'Access-Control-Allow-Origin',
        value: '*'
      });
    }

    return [
      {
        source: '/:path*',
        headers: baseHeaders
      },
      {
        source: '/.well-known/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Cache-Control',
            value: 'no-store'
          }
        ]
      }
    ];
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/api/:path*',
          destination: 'https://phemeprotocol.com/api/:path*'
        }
      ]
    }
    return []
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'www.phemeprotocol.com'
          }
        ],
        destination: 'https://phemeprotocol.com/:path*',
        permanent: true
      },
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'pheme-protocol.vercel.app'
          }
        ],
        destination: 'https://phemeprotocol.com/:path*',
        permanent: true
      },
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'pheme-protocol-pheme-webs-projects.vercel.app'
          }
        ],
        destination: 'https://phemeprotocol.com/:path*',
        permanent: true
      },
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'pheme-protocol-*.vercel.app'
          }
        ],
        destination: 'https://phemeprotocol.com/:path*',
        permanent: true
      }
    ]
  }
};

module.exports = nextConfig;
