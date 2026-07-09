import NextAuth from "next-auth"
import { authConfig } from "./server/auth/config"
import { API_AUTH_PREFIX, AUTH_ROUTES, DEFAULT_SIGNIN_REDIRECT, PUBLIC_ROUTES } from "./lib/route"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)
const REMOVED_BLOG_SLUGS = new Set(["ve-du-lich-son-la"]);

function removedBlogResponse(slug: string) {
  const html = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>404 - Blog post not found | Bloai Blog</title>
  </head>
  <body>
    <main>
      <h1>404</h1>
      <p>Blog post "${slug}" was not found.</p>
      <p><a href="/blog">Back to blog</a></p>
    </main>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export default auth(async function middleware(req) {
  const { nextUrl } = req;

  if (nextUrl.hostname === "bloai.blog") {
    const url = nextUrl.clone();
    url.hostname = "www.bloai.blog";
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  if (nextUrl.pathname === "/blog" && nextUrl.search) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }

  if (nextUrl.pathname === '/$') {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  if (nextUrl.pathname.startsWith('/chat/solutions') || nextUrl.pathname.startsWith('/chat')) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  const removedBlogMatch = nextUrl.pathname.match(/^\/blog\/([^/]+)\/?$/);
  const removedBlogSlug = removedBlogMatch?.[1];

  if (removedBlogSlug && REMOVED_BLOG_SLUGS.has(removedBlogSlug)) {
    return removedBlogResponse(removedBlogSlug);
  }

  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname) || 
                        nextUrl.pathname.startsWith('/blog') || 
                        nextUrl.pathname.startsWith('/search') ||
                        nextUrl.pathname.startsWith('/tag') || 
                        nextUrl.pathname.startsWith('/category') || 
                        nextUrl.pathname.startsWith('/author') ||
                        nextUrl.pathname.startsWith('/privacy') ||
                        nextUrl.pathname.startsWith('/faqs') ||
                        nextUrl.pathname.startsWith('/contact') ||
                        nextUrl.pathname.startsWith('/landing') ||
                        nextUrl.pathname.startsWith('/about') ||
                        nextUrl.pathname.startsWith('/images');
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl));
  }

  return NextResponse.next();
})

export const config = {
  matcher: [
    /* Match all pathnames except for API routes and static files */
    '/((?!api|_next/static|_next/image|images|favicon.ico).*)'
  ],
}
