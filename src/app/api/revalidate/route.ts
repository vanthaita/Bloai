import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag') || 'blog';
  const path = searchParams.get('path');

  if (path) {
    // Note: To use revalidatePath, you would import it from next/cache
    // revalidatePath(path);
  } else {
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: true, tag, now: Date.now() });
}
