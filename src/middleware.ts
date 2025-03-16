import NextAuth from "next-auth"
import { authConfig } from "./server/auth/config" 
import { API_AUTH_PREFIX, AUTH_ROUTES, DEFAULT_SIGNIN_REDIRECT, PUBLIC_ROUTES } from "./lib/route"
import { NextResponse } from "next/server"
const { auth } = NextAuth(authConfig)
export default auth(async function middleware(req) {
  const isLoggedIn = !!req.auth;
  const {nextUrl} = req;
  const isApiAuthRoute =  nextUrl.pathname.startsWith(API_AUTH_PREFIX);
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }


  if(isAuthRoute) {
    if(isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_SIGNIN_REDIRECT, nextUrl));
    }
    return NextResponse.next()
  }

  if(!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/signin", nextUrl));
  }


})
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}