/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import BundAnalyzer from '@next/bundle-analyzer'
/** @type {import("next").NextConfig} */

const config = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@tabler/icons-react',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-context-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-label',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'react-toastify',
      '@tanstack/react-query',
    ],
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'media.discordapp.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'imgur.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'miro.medium.com' },
      { protocol: 'https', hostname: 'placeholder.com' },
    ],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/$',
        destination: '/',
        permanent: true,
      },
      {
        source: '/chat/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog/huong-dan-su-dung-midjourney-de-tao-anh-ai',
        destination: '/blog/huong-dan-su-dung-midjourney-hieu-qua-khong-can-discord-2025',
        permanent: true,
      },
      {
        source: '/blog/huong-dan-su-dung-perplexity-ai-dje-viet-blog-hieu-qua-hon-2025',
        destination: '/blog/perplexity-ai-la-gi-huong-dan-viet-blog-hieu-qua-meo-hay-2025',
        permanent: true,
      },
      {
        source: '/blog/top-7-trinh-soan-thao-code-ai-tot-nhat-2025-huong-dan-chon-lua-so-sanh',
        destination: '/blog/trinh-soan-thao-code-ai-2025-huong-dan-chon-toi-uu-cho-lap-trinh-vien-2025',
        permanent: true,
      },
    ];
  },
};

const withBundleAnalyzer = BundAnalyzer({
  enabled: process.env.ANALYZE === "true"
})
export default withBundleAnalyzer(config);
