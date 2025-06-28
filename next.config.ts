import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['next-mdx-remote'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.scdn.co',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;