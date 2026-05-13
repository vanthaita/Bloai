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
  webpack(config, { isServer, dev }) {
    if (!isServer) {
      // Target modern browsers — removes polyfills for already-baseline features
      config.target = ['web', 'es2022'];

      if (!dev) {
        // Break the large shared chunk (1517-86ce, ~780ms CPU) into smaller pieces
        // so unused code is not downloaded on the critical path.
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            ...config.optimization?.splitChunks,
            chunks: 'all',
            maxInitialRequests: 25,
            minSize: 20_000,
            cacheGroups: {
              // Vendor: react / react-dom — almost never changes
              reactVendor: {
                test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                name: 'vendor-react',
                chunks: 'all',
                priority: 40,
              },
              // tRPC + tanstack-query — large but cacheable
              trpcVendor: {
                test: /[\\/]node_modules[\\/](@trpc|@tanstack)[\\/]/,
                name: 'vendor-trpc',
                chunks: 'all',
                priority: 30,
              },
              // Radix UI primitives — barrel-export optimized above, chunk separately
              radixVendor: {
                test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
                name: 'vendor-radix',
                chunks: 'all',
                priority: 20,
              },
              // Everything else in node_modules
              defaultVendors: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor-misc',
                chunks: 'all',
                priority: 10,
                reuseExistingChunk: true,
              },
            },
          },
        };
      }
    }
    return config;
  },
};

const withBundleAnalyzer = BundAnalyzer({
  enabled: process.env.ANALYZE === "true"
})
export default withBundleAnalyzer(config);
