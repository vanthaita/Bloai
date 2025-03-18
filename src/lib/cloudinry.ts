import { env } from '@/env';
import { CldImage } from 'next-cloudinary';

export const cloudinaryConfig = {
  cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  apiSecret: env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
};