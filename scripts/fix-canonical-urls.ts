/**
 * Fix SEO: Clear incorrect canonicalUrl fields for blog posts that point to
 * a different slug (causing Ahrefs "Canonical points to redirect" errors).
 *
 * Run with: npx ts-node --project tsconfig.json scripts/fix-canonical-urls.ts
 * Or: npx tsx scripts/fix-canonical-urls.ts
 */
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// Slugs whose canonicalUrl field should be cleared (set to null = self-canonical)
// These pages currently have canonicalUrl pointing to a DIFFERENT slug,
// which causes Ahrefs "Canonical points to redirect" warnings.
const SLUGS_TO_CLEAR_CANONICAL = [
  // New slugs that wrongly point their canonical to an old slug:
  'huong-dan-su-dung-midjourney-hieu-qua-khong-can-discord-2025',
  'perplexity-ai-la-gi-huong-dan-viet-blog-hieu-qua-meo-hay-2025',
  'trinh-soan-thao-code-ai-2025-huong-dan-chon-toi-uu-cho-lap-trinh-vien-2025',
  // Old slugs (the canonical targets) that now have no title and no incoming links:
  'huong-dan-su-dung-midjourney-de-tao-anh-ai',
  'huong-dan-su-dung-perplexity-ai-dje-viet-blog-hieu-qua-hon-2025',
  'top-7-trinh-soan-thao-code-ai-tot-nhat-2025-huong-dan-chon-lua-so-sanh',
];

async function main() {
  console.log('🔍 Checking current canonical URLs...\n');

  for (const slug of SLUGS_TO_CLEAR_CANONICAL) {
    const blog = await db.blog.findUnique({
      where: { slug },
      select: { slug: true, title: true, canonicalUrl: true },
    });

    if (!blog) {
      console.log(`⚠️  Blog not found: ${slug}`);
      continue;
    }

    console.log(`📄 ${slug}`);
    console.log(`   Title: ${blog.title}`);
    console.log(`   Current canonical: ${blog.canonicalUrl || '(none = self-canonical)'}`);

    if (blog.canonicalUrl) {
      await db.blog.update({
        where: { slug },
        data: { canonicalUrl: null },
      });
      console.log(`   ✅ Cleared canonical URL\n`);
    } else {
      console.log(`   ℹ️  Already self-canonical, no change needed\n`);
    }
  }

  console.log('✅ Done! All canonical URLs have been fixed.');
  console.log('\n💡 Next steps:');
  console.log('   1. Deploy the code changes');
  console.log('   2. Wait for Ahrefs to re-crawl (or manually submit IndexNow)');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
