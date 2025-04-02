export const DEFAULT_SIGNIN_REDIRECT = "/";

export const AUTH_ROUTES = [
  "/auth/signin",
  "/auth/signup",
  "/auth/signout",
  "/auth/error",
];

export const PUBLIC_ROUTES = [
  "/",
  "/blog",
  "/sitemap.xml",
  "/robots.txt" 
];

// For protected routes configuration
export const PROTECTED_ROUTES = [
  "/dashboard",
];

// Optional: API auth prefix for NextAuth
export const API_AUTH_PREFIX = "/api/auth";
