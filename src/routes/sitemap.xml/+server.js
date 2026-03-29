import { env as publicEnv } from "$env/dynamic/public";
import { apartments } from "$lib/data/apartments.js";
import { absoluteUrl } from "$lib/seo.js";

const staticRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/apartmani", changefreq: "weekly", priority: "0.95" },
  { path: "/o-nama", changefreq: "monthly", priority: "0.7" },
  { path: "/kontakt", changefreq: "monthly", priority: "0.7" },
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET({ url }) {
  const origin = publicEnv.PUBLIC_SITE_URL || url.origin;
  const lastmod = new Date().toISOString();

  const routes = [
    ...staticRoutes.map((route) => ({
      loc: absoluteUrl(route.path, origin),
      changefreq: route.changefreq,
      priority: route.priority,
    })),
    ...apartments.map((apartment) => ({
      loc: absoluteUrl(apartment.href, origin),
      changefreq: "weekly",
      priority: "0.9",
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${escapeXml(route.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
}
