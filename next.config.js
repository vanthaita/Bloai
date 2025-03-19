/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ['picsum.photos', 'lh3.googleusercontent.com','res.cloudinary.com'],
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default config;
