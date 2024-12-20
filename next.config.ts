import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        domains: [
            'firebasestorage.googleapis.com',
            'static.vecteezy.com',
            'i.pinimg.com',
            'lh3.googleusercontent.com',
        ],
    },
    int: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
