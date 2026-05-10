/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import BundAnalyzer from '@next/bundle-analyzer'
/** @type {import("next").NextConfig} */

const config = {
  images: {
    domains: ['picsum.photos', 'lh3.googleusercontent.com','res.cloudinary.com', 'media.discordapp.net', 'images.unsplash.com', 'imgur.com', 'i.imgur.com', 'miro.medium.com', 'placeholder.com'],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
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
