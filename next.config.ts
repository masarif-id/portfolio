import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    transpilePackages: ['next-mdx-remote'],
    images: {
        domains: ['i.scdn.co'],
    },
};

export default nextConfig;