import { env as publicEnv } from "$env/dynamic/public";
import { absoluteUrl } from "$lib/seo.js";

export function GET({ url }) {
  const origin = publicEnv.PUBLIC_SITE_URL || url.origin;
  const sitemapUrl = absoluteUrl("/sitemap.xml", origin);

  const body = `User-agent: *
Allow: /

Disallow: /login
Disallow: /dashboard

Sitemap: ${sitemapUrl}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
}
