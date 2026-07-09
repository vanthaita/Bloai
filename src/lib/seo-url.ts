export const CANONICAL_SITE_URL = "https://www.bloai.blog";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function getCanonicalSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!configuredUrl) {
    return CANONICAL_SITE_URL;
  }

  try {
    const url = new URL(configuredUrl);

    if (LOCAL_HOSTS.has(url.hostname)) {
      return CANONICAL_SITE_URL;
    }

    if (url.hostname === "bloai.blog") {
      url.hostname = "www.bloai.blog";
    }

    url.protocol = "https:";
    url.pathname = "";
    url.search = "";
    url.hash = "";

    return url.toString().replace(/\/$/, "");
  } catch {
    return CANONICAL_SITE_URL;
  }
}

export function getBlogUrl(slug: string) {
  return `${getCanonicalSiteUrl()}/blog/${slug}`;
}

export function getCanonicalBlogUrl(slug: string, canonicalUrl?: string | null) {
  const selfUrl = getBlogUrl(slug);
  const siteUrl = getCanonicalSiteUrl();
  const siteOrigin = new URL(siteUrl).origin;

  if (!canonicalUrl) {
    return selfUrl;
  }

  try {
    const parsedCanonical = new URL(canonicalUrl, siteOrigin);

    if (parsedCanonical.hostname === "bloai.blog") {
      parsedCanonical.hostname = "www.bloai.blog";
      parsedCanonical.protocol = "https:";
    }

    if (parsedCanonical.origin !== siteOrigin) {
      return selfUrl;
    }

    if (parsedCanonical.pathname !== `/blog/${slug}`) {
      return selfUrl;
    }

    parsedCanonical.search = "";
    parsedCanonical.hash = "";

    return parsedCanonical.toString();
  } catch {
    return selfUrl;
  }
}

export function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
