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
      'embla-carousel-react',
      // NOTE: @tanstack/react-query intentionally excluded — it is not a barrel-export
      // package and including it here can break QueryClientProvider initialization order.
    ],
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
    // Inline critical CSS — shrinks the 14 KiB unused CSS identified by Lighthouse
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
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
      { protocol: 'https', hostname: 'randomuser.me' },
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
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
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
  webpack(config, { isServer }) {
    if (!isServer) {
      // Target modern browsers — removes polyfills for already-baseline features
      config.target = ['web', 'es2022'];

      // Prefer ESM builds ('module' field) over CJS ('main' field).
      // Many packages ship both; the CJS build includes Babel-compiled polyfills
      // (@babel/plugin-transform-classes, Array.prototype.at, etc.) while the
      // ESM build targets modern JS. This eliminates the ~12 KiB legacy JS Lighthouse flagged.
      // NOTE: We intentionally do NOT override splitChunks — Next.js 15's built-in
      // chunk splitting is already optimal; a custom catch-all caused a single 657 kB chunk.
      config.resolve = {
        ...config.resolve,
        mainFields: ['browser', 'module', 'main'],
      };
    }
    return config;
  },
};

const withBundleAnalyzer = BundAnalyzer({
  enabled: process.env.ANALYZE === "true"
})
export default withBundleAnalyzer(config);
