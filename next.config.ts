import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude server-only modules from the client-side bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "child_process": false,
        "fs": false,
        "net": false,
        "tls": false,
        "mongodb-client-encryption": false,
        "aws4": false,
        "@mongodb-js/zstd": false,
        "snappy": false,
        "@aws-sdk/credential-providers": false,
        "kerberos": false,
        "gcp-metadata": false,
        "@aws-sdk/client-cognito-identity": false, 
      };
    }
    return config;
  },
};

export default nextConfig;
